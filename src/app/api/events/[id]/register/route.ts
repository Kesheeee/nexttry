import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const supabase = createAdminClient();

    const { data } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", id)
      .eq("user_id", session.user.id)
      .maybeSingle();

    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const supabase = createAdminClient();

    // Verify event exists and is published
    const { data: event } = await supabase
      .from("events")
      .select("id, capacity")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();

    if (!event) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }

    // Check capacity
    if (event.capacity) {
      const { count } = await supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", id)
        .eq("status", "registered");

      if ((count || 0) >= event.capacity) {
        return NextResponse.json(
          { error: { code: "EVENT_FULL", message: "This event is full." } },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("event_registrations")
      .insert({ event_id: id, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: { code: "REGISTER_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("event_registrations")
      .update({ status: "cancelled" })
      .eq("event_id", id)
      .eq("user_id", session.user.id);

    if (error) {
      return NextResponse.json(
        { error: { code: "CANCEL_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { cancelled: true } });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
