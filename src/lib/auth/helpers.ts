import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getSession() {
  return auth();
}

/**
 * Returns the session if authenticated, otherwise throws a Response with 401.
 * Use in API routes wrapped in try/catch.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "admin") {
    throw NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 }
    );
  }
  return session;
}
