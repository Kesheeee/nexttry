import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/nspace/events?from=<iso>&to=<iso>
 *
 * Lists scheduled event instances within a window (default: next 60 days).
 * Each event includes the joined series fields and a derived rsvp_count.
 * Limit 50.
 */
export async function GET(req: Request) {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const url = new URL(req.url);
    const now = new Date();
    const defaultTo = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const from = url.searchParams.get("from") ?? now.toISOString();
    const to = url.searchParams.get("to") ?? defaultTo.toISOString();

    const { data, error } = await supabase
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
        ),
        confirmed_rsvps:nspace_event_rsvps ( id, status )
      `)
      .eq("status", "scheduled")
      .gte("starts_at", from)
      .lte("starts_at", to)
      .order("starts_at", { ascending: true })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: { code: "QUERY_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    // Flatten: count only confirmed RSVPs and drop the raw rows from the response.
    const events = (data ?? []).map(({ confirmed_rsvps, ...rest }) => ({
      ...rest,
      rsvp_count: (confirmed_rsvps as { id: string; status: string }[] | null ?? [])
        .filter((r) => r.status === "confirmed").length,
    }));

    return NextResponse.json({ data: events });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
