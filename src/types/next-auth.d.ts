import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      lifeStage: string | null;
      locale: "en" | "zh";
      billingPlan: string;
      onboardingCompleted: boolean;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    lifeStage?: string | null;
    locale?: "en" | "zh";
    billingPlan?: string;
    onboardingCompleted?: boolean;
    role?: string;
  }
}
