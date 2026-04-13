import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators/contact";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limit: 5 per hour per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rl = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Try again later." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Please check your input.",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);

    if (error) {
      return NextResponse.json(
        { error: { code: "SUBMIT_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { received: true } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
