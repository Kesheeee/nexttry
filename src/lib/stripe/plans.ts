export const BILLING_PLANS = {
  free: {
    name: { en: "Free", zh: "免費" },
    price_monthly_hkd: 0,
    stripe_price_id: null,
    features: {
      en: [
        "5 AI conversations/month",
        "20 messages per conversation",
        "Event registration",
      ],
      zh: ["每月5次AI對話", "每次對話20條訊息", "活動報名"],
    },
  },
  starter: {
    name: { en: "Starter", zh: "入門" },
    price_monthly_hkd: 48,
    stripe_price_id: process.env.STRIPE_STARTER_PRICE_ID!,
    features: {
      en: [
        "30 AI conversations/month",
        "50 messages per conversation",
        "Priority event access",
      ],
      zh: ["每月30次AI對話", "每次對話50條訊息", "優先活動名額"],
    },
  },
  pro: {
    name: { en: "Pro", zh: "專業" },
    price_monthly_hkd: 128,
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID!,
    features: {
      en: [
        "Unlimited AI conversations",
        "Unlimited messages",
        "All event access",
        "Early feature access",
      ],
      zh: ["無限AI對話", "無限訊息", "所有活動通行", "搶先體驗新功能"],
    },
  },
} as const;

export type PlanKey = keyof typeof BILLING_PLANS;

export function getPlanByPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(BILLING_PLANS)) {
    if (plan.stripe_price_id === priceId) return key as PlanKey;
  }
  return null;
}
