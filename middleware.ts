import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect dashboard routes
  const isProtected = pathname.startsWith("/dashboard") || pathname === "/onboarding";
  if (isProtected && !session) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Route logged-in users who haven't onboarded to onboarding
  if (
    session?.user &&
    !session.user.onboardingCompleted &&
    pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Skip onboarding if already completed
  if (session?.user?.onboardingCompleted && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
