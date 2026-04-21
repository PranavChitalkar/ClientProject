import { NextRequest, NextResponse } from "next/server";
import { createResetCodeForConfiguredAdmin, getConfiguredAdminEmail } from "@/lib/admin-auth";
import { sendAdminResetCodeEmail } from "@/lib/email";

export async function POST(_request: NextRequest) {
  try {
    const reset = await createResetCodeForConfiguredAdmin();
    if (reset) {
      await sendAdminResetCodeEmail(reset.email, reset.code);
    }

    return NextResponse.json({
      ok: true,
      message: `Verification code sent to configured admin email (${getConfiguredAdminEmail()}).`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send reset code.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
