import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/nspace/events/[id]
 *
 * Returns a single event instance with joined series and the current
 * user's RSVP row (or null if they haven't RSVPed).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const me = session.user.id;
    const { id } = await params;
    const supabase = createAdminClient();

    const [eventRes, rsvpRes, countRes] = await Promise.all([
      supabase
        .from("nspace_events")
        .select(`
          id,
          series_id,
          starts_at,
          ends_at,
          capacity_override,
          status,
          created_at,
          series:nspace_event_series (
            title,
            description,
            venue_id,
            location_text,
            capacity,
            price_cents,
            venue:nspace_venues ( id, name, neighborhood, address )
          )
        `)
        .eq("id", id)
        .maybeSingle(),

      supabase
        .from("nspace_event_rsvps")
        .select("id, event_id, user_id, status, created_at, updated_at")
        .eq("event_id", id)
        .eq("user_id", me)
        .maybeSingle(),

      supabase
        .from("nspace_event_rsvps")
        .select("id", { count: "exact", head: true })
        .eq("event_id", id)
        .eq("status", "confirmed"),
    ]);

    if (eventRes.error) {
      return NextResponse.json(
        { error: { code: "QUERY_FAILED", message: eventRes.error.message } },
        { status: 500 }
      );
    }
    if (!eventRes.data) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        ...eventRes.data,
        rsvp_count: countRes.count ?? 0,
        your_rsvp: rsvpRes.data ?? null,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
