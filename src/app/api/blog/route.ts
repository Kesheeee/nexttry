import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
    const offset = Number(searchParams.get("offset") || 0);
    const tag = searchParams.get("tag");
    const stage = searchParams.get("stage");

    const supabase = createAdminClient();
    let query = supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (tag) query = query.contains("tags", [tag]);
    if (stage) query = query.contains("target_stages", [stage]);

    const { data, count, error } = await query;
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
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
