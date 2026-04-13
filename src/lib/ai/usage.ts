import { createAdminClient } from "@/lib/supabase/server";

export const PLAN_LIMITS = {
  free: {
    conversations_per_month: 5,
    messages_per_conversation: 20,
  },
  starter: {
    conversations_per_month: 30,
    messages_per_conversation: 50,
  },
  pro: {
    conversations_per_month: -1, // unlimited
    messages_per_conversation: -1,
  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

function startOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

interface UsageCheckResult {
  ok: boolean;
  limitType?: string;
  current?: number;
  max?: number;
}

export async function checkUserUsage(
  userId: string,
  plan: Plan,
  conversationId: string
): Promise<UsageCheckResult> {
  const limits = PLAN_LIMITS[plan];
  const supabase = createAdminClient();

  // Check conversations created this month
  if (limits.conversations_per_month !== -1) {
    const { count: convCount } = await supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth());

    if ((convCount || 0) >= limits.conversations_per_month) {
      return {
        ok: false,
        limitType: "conversations_per_month",
        current: convCount || 0,
        max: limits.conversations_per_month,
      };
    }
  }

  // Check messages in current conversation
  if (limits.messages_per_conversation !== -1) {
    const { count: msgCount } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", conversationId);

    if ((msgCount || 0) >= limits.messages_per_conversation) {
      return {
        ok: false,
        limitType: "messages_per_conversation",
        current: msgCount || 0,
        max: limits.messages_per_conversation,
      };
    }
  }

  return { ok: true };
}

export async function logUsage(
  userId: string,
  action: "ai_message" | "ai_conversation",
  metadata: Record<string, unknown> = {}
) {
  const supabase = createAdminClient();
  await supabase.from("usage_logs").insert({ user_id: userId, action, metadata });
}
