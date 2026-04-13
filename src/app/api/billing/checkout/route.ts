import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { BILLING_PLANS } from "@/lib/stripe/plans";
import { checkoutSchema } from "@/lib/validators/billing";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid plan." } },
        { status: 400 }
      );
    }

    const plan = BILLING_PLANS[parsed.data.plan];
    if (!plan.stripe_price_id) {
      return NextResponse.json(
        { error: { code: "INVALID_PLAN", message: "Plan not purchasable." } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id, email, name")
      .eq("id", session.user.id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found." } },
        { status: 404 }
      );
    }

    // Create Stripe customer if not exists
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { user_id: session.user.id },
      });
      customerId = customer.id;
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", session.user.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      currency: "hkd",
      customer: customerId,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?success=true`,
      cancel_url: `${appUrl}/dashboard/settings?cancelled=true`,
      metadata: { user_id: session.user.id, plan: parsed.data.plan },
    });

    return NextResponse.json({ data: { url: checkoutSession.url } });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: { code: "CHECKOUT_FAILED", message: "Could not start checkout." } },
      { status: 500 }
    );
  }
}
