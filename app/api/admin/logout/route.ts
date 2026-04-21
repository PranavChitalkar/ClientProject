import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, getSessionCookieName } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  try {
    const token = request.cookies.get(getSessionCookieName())?.value;
    if (token) {
      await clearAdminSession(token);
    }
  } catch {
    // ignore session cleanup failures
  }
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  return response;
}
