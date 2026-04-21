"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const adminEmail = "pranavchitalkar2005@gmail.com";
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || "Invalid admin login.");
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Unable to login right now. Please try again.");
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
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Login to the admin dashboard
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use your admin email and password stored in MongoDB to manage products, works,
          stock, orders, and payments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Admin Email
          </span>
          <input
            value={adminEmail}
            readOnly
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            type="email"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            type="password"
            placeholder="Enter admin password"
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:translate-y-[-1px] hover:from-orange-700 hover:to-red-700"
        >
          {isSubmitting ? "Please wait..." : "Open Dashboard"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-sm font-semibold text-slate-800">Forgot password?</p>
        <p className="mt-1 text-xs text-slate-500">Use link to open reset page and complete verification.</p>
        <Link
          href="/admin/forgot-password"
          className="mt-4 block w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-center text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
        >
          Open Forgot Password Page
        </Link>
      </div>
    </div>
  );
}
