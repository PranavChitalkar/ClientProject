import nodemailer from "nodemailer";

const TEMP_RESET_EMAIL = "pranavchitalkar2005@gmail.com";

export async function sendAdminResetCodeEmail(email: string, code: string) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || TEMP_RESET_EMAIL;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.ADMIN_RESET_TO_EMAIL || TEMP_RESET_EMAIL;

  if (!pass) {
    throw new Error("SMTP_PASS is missing. Add Gmail app password in .env.local to send reset emails.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Admin Password Reset Code",
    text: `Admin password reset requested for ${email}. Your verification code is ${code}. This code expires in 10 minutes.`,
    html: `<p>Admin password reset requested for <strong>${email}</strong>.</p><p>Your verification code is <strong style="font-size:20px;">${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
  });
}
