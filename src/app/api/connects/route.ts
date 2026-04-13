import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { addConnectSchema } from "@/lib/validators/connects";

interface ConnectRow {
  id: string;
  event_id: string | null;
  note: string | null;
  created_at: string;
  connected_user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
    life_stage: string | null;
    bio: string | null;
    social_links: Record<string, string>;
  } | null;
  event: { title: Record<string, string> } | null;
}

export async function GET() {
  try {
    const session = await requireAuth();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("connects")
      .select(`
        id, event_id, note, created_at,
        connected_user:users!connects_connected_user_id_fkey(
          id, name, avatar_url, life_stage, bio, social_links
        ),
        event:events(title)
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: { code: "QUERY_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const rows = (data as unknown as ConnectRow[]) || [];
    const formatted = rows.map((c) => ({
      id: c.id,
      user: c.connected_user,
      event_title: c.event?.title || null,
      note: c.note,
      connected_at: c.created_at,
    }));

    return NextResponse.json({ data: formatted });
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
    const body = await req.json();
    const parsed = addConnectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid share link." } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Look up registration by share_link_code
    const { data: registration } = await supabase
      .from("event_registrations")
      .select("user_id, event_id")
      .eq("share_link_code", parsed.data.share_link_code)
      .maybeSingle();

    if (!registration) {
      return NextResponse.json(
        { error: { code: "INVALID_CODE", message: "Invalid share link." } },
        { status: 404 }
      );
    }

    if (registration.user_id === session.user.id) {
      return NextResponse.json(
        { error: { code: "SELF_CONNECT", message: "You cannot connect with yourself." } },
        { status: 400 }
      );
    }

    // Create bidirectional connections
    await supabase.from("connects").upsert(
      [
        {
          user_id: session.user.id,
          connected_user_id: registration.user_id,
          event_id: registration.event_id,
        },
        {
          user_id: registration.user_id,
          connected_user_id: session.user.id,
          event_id: registration.event_id,
        },
      ],
      { onConflict: "user_id,connected_user_id", ignoreDuplicates: true }
    );

    const { data: newConnect } = await supabase
      .from("connects")
      .select(`id, note, created_at,
        connected_user:users!connects_connected_user_id_fkey(name, avatar_url, life_stage)`)
      .eq("user_id", session.user.id)
      .eq("connected_user_id", registration.user_id)
      .single();

    return NextResponse.json({ data: newConnect }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
