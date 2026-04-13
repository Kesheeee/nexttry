import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { updateConnectSchema } from "@/lib/validators/connects";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateConnectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input." } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("connects")
      .update({ note: parsed.data.note })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Connection not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
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

    // Find the connection to get both users
    const { data: conn } = await supabase
      .from("connects")
      .select("user_id, connected_user_id")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!conn) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Connection not found." } },
        { status: 404 }
      );
    }

    // Delete both sides of the connection
    await supabase
      .from("connects")
      .delete()
      .or(
        `and(user_id.eq.${conn.user_id},connected_user_id.eq.${conn.connected_user_id}),and(user_id.eq.${conn.connected_user_id},connected_user_id.eq.${conn.user_id})`
      );

    return NextResponse.json({ data: { removed: true } });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
