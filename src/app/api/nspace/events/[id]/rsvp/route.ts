import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/nspace/rate-limit";

const rsvpSchema = z.object({
  status: z.enum(["confirmed", "canceled"]),
});

/**
 * POST /api/nspace/events/[id]/rsvp
 *
 * Body: { status: "confirmed" | "canceled" }
 *
 * - Blocks if event.status !== 'scheduled'.
 * - On confirm: checks capacity (capacity_override ?? series.capacity).
 *   Returns 409 EVENT_FULL if at or above limit.
 * - Upserts (event_id, user_id) with the new status.
 * - Rate-limited: 20 RSVP writes per user per hour.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const me = session.user.id;
    const { id } = await params;

    const body = await req.json().catch(() => null);
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Invalid input.",
          },
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Rate limit: 20 rsvp writes / hour per user
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const rlKey = `events_rsvp:${me}:${ip}`;
    const rl = await checkRateLimit(
      supabase,
      "nspace_event_rsvps",
      "user_id",
      me,
      20,
      60 * 60
    );
    // We pass rlKey for traceability but checkRateLimit uses the table-level
    // count pattern from the existing codebase (no Redis).
    void rlKey;
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many RSVPs in a short time. Try later.",
          },
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    // Load the event + series in one query
    const { data: event, error: eventErr } = await supabase
      .from("nspace_events")
      .select(`
        id,
        status,
        capacity_override,
        series:nspace_event_series ( capacity )
      `)
      .eq("id", id)
      .maybeSingle();

    if (eventErr) {
      return NextResponse.json(
        { error: { code: "QUERY_FAILED", message: eventErr.message } },
        { status: 500 }
      );
    }
    if (!event) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }
    if (event.status !== "scheduled") {
      return NextResponse.json(
        {
          error: {
            code: "EVENT_NOT_SCHEDULABLE",
            message: `This event is ${event.status}.`,
          },
        },
        { status: 409 }
      );
    }

    // Capacity check — only relevant when confirming
    if (parsed.data.status === "confirmed") {
      const series = Array.isArray(event.series)
        ? event.series[0]
        : event.series;
      const effectiveCapacity =
        event.capacity_override ?? (series as { capacity: number } | null)?.capacity ?? 0;

      const { count: confirmedCount } = await supabase
        .from("nspace_event_rsvps")
        .select("id", { count: "exact", head: true })
        .eq("event_id", id)
        .eq("status", "confirmed");

      // Exclude the current user's existing RSVP from the count so
      // re-confirming after a cancel doesn't falsely block them.
      const { data: existingRsvp } = await supabase
        .from("nspace_event_rsvps")
        .select("id, status")
        .eq("event_id", id)
        .eq("user_id", me)
        .maybeSingle();

      const alreadyConfirmed = existingRsvp?.status === "confirmed";
      const occupiedSlots = (confirmedCount ?? 0) - (alreadyConfirmed ? 1 : 0);

      if (occupiedSlots >= effectiveCapacity) {
        return NextResponse.json(
          {
            error: {
              code: "EVENT_FULL",
              message: "This event is full.",
            },
          },
          { status: 409 }
        );
      }
    }

    const now = new Date().toISOString();

    const { data: rsvp, error: upsertErr } = await supabase
      .from("nspace_event_rsvps")
      .upsert(
        {
          event_id: id,
          user_id: me,
          status: parsed.data.status,
          updated_at: now,
        },
        { onConflict: "event_id,user_id" }
      )
      .select("id, event_id, user_id, status, created_at, updated_at")
      .single();

    if (upsertErr) {
      return NextResponse.json(
        { error: { code: "UPSERT_FAILED", message: upsertErr.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: rsvp });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
