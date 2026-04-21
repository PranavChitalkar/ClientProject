import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdminWithPasswordOnly,
  createAdminSession,
  getConfiguredAdminEmail,
  getSessionCookieName,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password || "";
    if (!password) {
      return NextResponse.json({ ok: false, message: "Password is required." }, { status: 400 });
    }

    const user = await authenticateAdminWithPasswordOnly(password);
    if (!user) {
      return NextResponse.json({ ok: false, message: "Invalid admin password." }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession(String(user._id));
    const response = NextResponse.json({ ok: true, email: getConfiguredAdminEmail() });
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
