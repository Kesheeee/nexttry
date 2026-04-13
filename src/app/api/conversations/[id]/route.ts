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
    const { data: conversation, error: cErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (cErr || !conversation) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Conversation not found." } },
        { status: 404 }
      );
    }

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    return NextResponse.json({ data: { ...conversation, messages: messages || [] } });
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
      .from("conversations")
      .update({ is_archived: true })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      return NextResponse.json(
        { error: { code: "ARCHIVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { archived: true } });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
