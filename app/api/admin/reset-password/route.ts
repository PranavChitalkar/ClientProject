import { NextRequest, NextResponse } from "next/server";
import { resetConfiguredAdminPasswordWithCode } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
      newPassword?: string;
    };
    const code = body.code?.trim() || "";
    const newPassword = body.newPassword || "";

    if (!code || !newPassword) {
      return NextResponse.json(
        { ok: false, message: "Verification code and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, message: "New password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    const changed = await resetConfiguredAdminPasswordWithCode(code, newPassword);
    if (!changed) {
      return NextResponse.json(
        { ok: false, message: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, message: "Password reset successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reset password.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
