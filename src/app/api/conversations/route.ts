import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { createConversationSchema } from "@/lib/validators/conversation";
import { logUsage } from "@/lib/ai/usage";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
    const offset = Number(searchParams.get("offset") || 0);

    const supabase = createAdminClient();
    const { data, error, count } = await supabase
      .from("conversations")
      .select("*", { count: "exact" })
      .eq("user_id", session.user.id)
      .eq("is_archived", false)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: { code: "QUERY_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      meta: { total: count, hasMore: (count || 0) > offset + limit },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json().catch(() => ({}));
    const parsed = createConversationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input." } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: session.user.id,
        title: parsed.data.title || null,
        life_stage: session.user.lifeStage,
        locale: session.user.locale,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: { code: "CREATE_FAILED", message: error?.message || "Failed" } },
        { status: 500 }
      );
    }

    await logUsage(session.user.id, "ai_conversation", { conversation_id: data.id });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
