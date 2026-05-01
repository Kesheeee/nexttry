import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators/contact";
import { checkRateLimit } from "@/lib/rate-limit";

const TEAM_EMAIL = "hakest@nexttryhk.com";
// "from" must be on a domain you've verified in Resend.
// Until nexttryhk.com is verified, Resend's sandbox sender lets you email yourself.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "NextTry <onboarding@resend.dev>";

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

    // 1. Save to Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from("contact_submissions").insert(parsed.data);

    if (dbError) {
      return NextResponse.json(
        { error: { code: "SUBMIT_FAILED", message: dbError.message } },
        { status: 500 }
      );
    }

    // 2. Email the team via Resend (best-effort — DB save is the source of truth)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const { name, email, subject, message } = parsed.data;
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TEAM_EMAIL,
          replyTo: email,
          subject: subject ? `Contact: ${subject}` : `New contact from ${name}`,
          text: `From: ${name} <${email}>\n${subject ? `Subject: ${subject}\n` : ""}\n${message}`,
        });
      } catch (mailErr) {
        // Log but don't fail the request — submission is already in DB
        console.error("Resend email failed:", mailErr);
      }
    }

    return NextResponse.json({ data: { received: true } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
