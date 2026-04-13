import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText, generateText } from "ai";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { sendMessageSchema } from "@/lib/validators/conversation";
import { checkUserUsage, logUsage, type Plan } from "@/lib/ai/usage";
import { getGolnextSystemPrompt, getTitleGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: conversationId } = await params;

    const body = await req.json();
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input." } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify conversation belongs to user
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!conversation) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Conversation not found." } },
        { status: 404 }
      );
    }

    // Check usage limits
    const plan = (session.user.billingPlan || "free") as Plan;
    const usage = await checkUserUsage(session.user.id, plan, conversationId);
    if (!usage.ok) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "You've reached your limit. Upgrade your plan to continue.",
            details: { limit_type: usage.limitType, current: usage.current, max: usage.max },
          },
        },
        { status: 429 }
      );
    }

    // Save user message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: parsed.data.content,
    });

    // Load recent history (last 50 messages)
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(50);

    const messagesForAI = (history || []).map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    // Stream AI response
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: getGolnextSystemPrompt(conversation.life_stage, conversation.locale || "en"),
      messages: messagesForAI,
      onFinish: async ({ text }) => {
        // Save assistant message
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: text,
        });

        // Increment message count + bump updated_at
        await supabase
          .from("conversations")
          .update({
            message_count: (conversation.message_count || 0) + 2,
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId);

        await logUsage(session.user.id, "ai_message", { conversation_id: conversationId });

        // Auto-generate title on first message pair
        if (!conversation.title && messagesForAI.length <= 2) {
          try {
            const { text: generatedTitle } = await generateText({
              model: google("gemini-2.5-flash"),
              system: getTitleGenerationPrompt(),
              messages: [
                { role: "user", content: parsed.data.content },
                { role: "assistant", content: text },
              ],
            });
            await supabase
              .from("conversations")
              .update({ title: generatedTitle.trim().slice(0, 200) })
              .eq("id", conversationId);
          } catch {
            // Silent fail — title is optional
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
