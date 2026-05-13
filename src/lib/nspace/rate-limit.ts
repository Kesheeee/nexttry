import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Counts how many rows the user has inserted into a given table within the
 * last `windowSeconds`, and returns whether they're over the limit.
 *
 * No new infra: piggybacks on existing tables that already have created_at.
 * Works on any deployment (no Redis/KV needed).
 *
 * Trade-off: each rate-limit check is one DB round-trip. Acceptable for
 * write endpoints where the user is already going to do a write.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  table: string,
  userField: string,
  userId: string,
  maxInWindow: number,
  windowSeconds: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq(userField, userId)
    .gte("created_at", since);

  if (error) {
    // Fail open — never deny a user due to a rate-limit infra failure.
    console.warn("[rate-limit] check failed:", error.message);
    return { ok: true };
  }

  if ((count ?? 0) >= maxInWindow) {
    return { ok: false, retryAfterSec: windowSeconds };
  }
  return { ok: true };
}

/**
 * Standard limits used across the app. Centralized so we can tune without
 * touching every endpoint.
 */
export const RATE_LIMITS = {
  message: { max: 60, windowSec: 60 },          // 60 / minute
  moment: { max: 30, windowSec: 60 * 60 },      // 30 / hour
  connection_request: { max: 20, windowSec: 60 * 60 }, // 20 / hour
  meetup: { max: 10, windowSec: 60 * 60 },      // 10 / hour
} as const;
