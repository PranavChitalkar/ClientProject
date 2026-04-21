"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminForgotPasswordForm() {
  const router = useRouter();
  const adminEmail = "pranavchitalkar2005@gmail.com";
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || "Unable to send verification code.");
        return;
      }
      setShowReset(true);
      setSuccess("Verification code sent. Check your email inbox.");
    } catch {
      setError("Unable to send verification code right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode, newPassword }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || "Unable to reset password.");
        return;
      }
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        router.push("/admin/login");
      }, 1200);
    } catch {
      setError("Unable to reset password right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-xs font-black text-white">
            ME
          </div>
          <p className="text-lg font-black uppercase tracking-tight text-slate-900">MATOSHREE Admin</p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Reset admin password</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Send verification code to {adminEmail}, set new password, then login again.
        </p>
      </div>

      {!showReset ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
          >
            {isSubmitting ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            type="text"
            placeholder="6-digit verification code"
            required
          />
          <input
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            type="password"
            placeholder="New password (min 8 characters)"
            minLength={8}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => router.push("/admin/login")}
        className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Back to Login
      </button>
    </div>
  );
}
