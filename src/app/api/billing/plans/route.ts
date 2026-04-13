import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BILLING_PLANS } from "@/lib/stripe/plans";

export async function GET() {
  const session = await auth();

  return NextResponse.json({
    data: {
      plans: BILLING_PLANS,
      current_plan: session?.user?.billingPlan || "free",
    },
  });
}
