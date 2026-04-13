import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";

export async function POST() {
  try {
    const session = await requireAuth();
    const supabase = createAdminClient();

    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", session.user.id)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        { error: { code: "NO_CUSTOMER", message: "No billing account yet. Subscribe first." } },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${appUrl}/dashboard/settings`,
    });

    return NextResponse.json({ data: { url: portalSession.url } });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Portal error:", err);
    return NextResponse.json(
      { error: { code: "PORTAL_FAILED", message: "Could not open billing portal." } },
      { status: 500 }
    );
  }
}
