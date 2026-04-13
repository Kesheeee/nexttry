import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import { getPlanByPriceId } from "@/lib/stripe/plans";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        const customerId = session.customer as string;

        if (userId && plan) {
          const cycleEnd = new Date();
          cycleEnd.setMonth(cycleEnd.getMonth() + 1);

          await supabase
            .from("users")
            .update({
              billing_plan: plan,
              stripe_customer_id: customerId,
              billing_cycle_end: cycleEnd.toISOString(),
            })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const cycleEnd = new Date();
        cycleEnd.setMonth(cycleEnd.getMonth() + 1);

        await supabase
          .from("users")
          .update({ billing_cycle_end: cycleEnd.toISOString() })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await supabase
          .from("users")
          .update({ billing_plan: "free", billing_cycle_end: null })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = sub.items.data[0]?.price.id;
        const plan = priceId ? getPlanByPriceId(priceId) : null;

        if (plan) {
          await supabase
            .from("users")
            .update({ billing_plan: plan })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Always return 200 to avoid Stripe retries on our logic errors
    return NextResponse.json({ received: true });
  }
}
