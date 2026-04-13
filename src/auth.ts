import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createAdminClient } from "@/lib/supabase/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const supabase = createAdminClient();
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!existing) {
        await supabase.from("users").insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          onboarding_completed: false,
        });
      } else {
        await supabase
          .from("users")
          .update({
            name: user.name,
            avatar_url: user.image,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;

      if (token.email) {
        const supabase = createAdminClient();
        const { data } = await supabase
          .from("users")
          .select("id, life_stage, locale, billing_plan, onboarding_completed, role")
          .eq("email", token.email)
          .maybeSingle();

        if (data) {
          token.userId = data.id;
          token.lifeStage = data.life_stage;
          token.locale = data.locale;
          token.billingPlan = data.billing_plan;
          token.onboardingCompleted = data.onboarding_completed;
          token.role = data.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId as string;
        session.user.lifeStage = token.lifeStage as string | null;
        session.user.locale = (token.locale as "en" | "zh") ?? "en";
        session.user.billingPlan = (token.billingPlan as string) ?? "free";
        session.user.onboardingCompleted = !!token.onboardingCompleted;
        session.user.role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
});
