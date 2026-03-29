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
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-sky-100 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
          Admin Access
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Login to the business dashboard
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This is a frontend demo login. It opens the admin dashboard view for
          works, finances, stock, orders, and payment tracking.
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
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            type="email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            type="password"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px]"
        >
          Open Dashboard
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-amber-900">
        <p className="font-semibold">Demo credentials</p>
        <p className="mt-1">Email: {adminCredentials.email}</p>
        <p>Password: {adminCredentials.password}</p>
      </div>
    </div>
  );
}
