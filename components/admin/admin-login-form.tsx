"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminCredentials } from "@/data/admin-data";

const SESSION_KEY = "safepath-admin-session";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(adminCredentials.email);
  const [password, setPassword] = useState(adminCredentials.password);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      localStorage.setItem(SESSION_KEY, "active");
      router.push("/admin/dashboard");
      return;
    }

    setError("Invalid admin login. Use the demo credentials shown below.");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-xs font-black text-white">
            AKB
          </div>
          <p className="text-lg font-black uppercase tracking-tight text-slate-900">AKB Admin</p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Login to the admin dashboard
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use the normal admin email and password to open the dashboard for products,
          works, stock, orders, and payments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Admin Email
          </span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            type="email"
            placeholder="admin@example.com"
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
          className="w-full rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:translate-y-[-1px] hover:from-orange-700 hover:to-red-700"
        >
          Open Dashboard
        </button>
      </form>

     
    </div>
  );
}
