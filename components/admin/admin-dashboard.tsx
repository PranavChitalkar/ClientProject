"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  completedWorks,
  orderPayments,
  runningWorks,
  stockItems,
  type OrderPayment,
  type RunningWork,
} from "@/data/admin-data";
import { company } from "@/data/site-content";

const SESSION_KEY = "safepath-admin-session";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const initialWorkForm = {
  project: "",
  client: "",
  location: "",
  status: "",
  progress: "0",
  budget: "",
};

const initialOrderForm = {
  orderId: "",
  client: "",
  totalAmount: "",
  advancePaid: "",
  receivedAmount: "",
  paymentStatus: "",
};

export function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [works, setWorks] = useState<RunningWork[]>(runningWorks);
  const [orders, setOrders] = useState<OrderPayment[]>(orderPayments);
  const [workForm, setWorkForm] = useState(initialWorkForm);
  const [orderForm, setOrderForm] = useState(initialOrderForm);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);

    if (session !== "active") {
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    router.push("/admin/login");
  }

  function handleAddWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextWork: RunningWork = {
      project: workForm.project,
      client: workForm.client,
      location: workForm.location,
      status: workForm.status,
      progress: Number(workForm.progress || 0),
      budget: Number(workForm.budget || 0),
    };

    setWorks((current) => [nextWork, ...current]);
    setWorkForm(initialWorkForm);
  }

  function handleAddOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const totalAmount = Number(orderForm.totalAmount || 0);
    const advancePaid = Number(orderForm.advancePaid || 0);
    const receivedAmount = Number(orderForm.receivedAmount || 0);

    const nextOrder: OrderPayment = {
      orderId: orderForm.orderId,
      client: orderForm.client,
      totalAmount,
      advancePaid,
      receivedAmount,
      remainingAmount: Math.max(totalAmount - receivedAmount, 0),
      paymentStatus: orderForm.paymentStatus,
    };

    setOrders((current) => [nextOrder, ...current]);
    setOrderForm(initialOrderForm);
  }

  function markPaymentReceived(orderId: string) {
    setOrders((current) =>
      current.map((order) => {
        if (order.orderId !== orderId || order.remainingAmount <= 0) {
          return order;
        }

        const installment = Math.min(order.remainingAmount, Math.round(order.totalAmount * 0.25));
        const updatedReceived = order.receivedAmount + installment;
        const updatedRemaining = Math.max(order.totalAmount - updatedReceived, 0);

        return {
          ...order,
          receivedAmount: updatedReceived,
          remainingAmount: updatedRemaining,
          paymentStatus:
            updatedRemaining === 0
              ? "Payment completed"
              : `Part payment received - ${Math.round((updatedReceived / order.totalAmount) * 100)}%`,
        };
      }),
    );
  }

  const financeSummary = [
    {
      label: "Current Running Budget",
      value: formatCurrency(works.reduce((sum, item) => sum + item.budget, 0)),
    },
    {
      label: "Payments Received",
      value: formatCurrency(orders.reduce((sum, item) => sum + item.receivedAmount, 0)),
    },
    {
      label: "Outstanding Payments",
      value: formatCurrency(orders.reduce((sum, item) => sum + item.remainingAmount, 0)),
    },
    {
      label: "Advance Collected",
      value: formatCurrency(orders.reduce((sum, item) => sum + item.advancePaid, 0)),
    },
  ];

  const dashboardStats = [
    {
      label: "Running Works",
      value: String(works.length),
      change: `${works.filter((item) => item.progress < 100).length} active jobs`,
    },
    {
      label: "Completed Works",
      value: String(completedWorks.length),
      change: "Recently delivered projects",
    },
    {
      label: "Pending Orders",
      value: String(orders.filter((item) => item.remainingAmount > 0).length),
      change: "Commercial follow-up in progress",
    },
    {
      label: "Outstanding Payments",
      value: formatCurrency(orders.reduce((sum, item) => sum + item.remainingAmount, 0)),
      change: "Includes balance and pending advances",
    },
  ];

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-sky-100 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {company.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              View Website
            </a>
            <button
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.75rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {item.value}
              </p>
              <p className="mt-3 text-sm text-emerald-600">{item.change}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                  Running Works
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Current project execution
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleAddWork}
              className="mb-6 grid gap-4 rounded-[1.5rem] border border-sky-100 bg-sky-50/70 p-5 md:grid-cols-2"
            >
              <input
                required
                placeholder="Project name"
                value={workForm.project}
                onChange={(event) =>
                  setWorkForm((current) => ({ ...current, project: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                placeholder="Client name"
                value={workForm.client}
                onChange={(event) =>
                  setWorkForm((current) => ({ ...current, client: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                placeholder="Location"
                value={workForm.location}
                onChange={(event) =>
                  setWorkForm((current) => ({ ...current, location: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                placeholder="Current status"
                value={workForm.status}
                onChange={(event) =>
                  setWorkForm((current) => ({ ...current, status: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                type="number"
                min="0"
                max="100"
                placeholder="Progress %"
                value={workForm.progress}
                onChange={(event) =>
                  setWorkForm((current) => ({ ...current, progress: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                type="number"
                min="0"
                placeholder="Budget amount"
                value={workForm.budget}
                onChange={(event) =>
                  setWorkForm((current) => ({ ...current, budget: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Add New Work
              </button>
            </form>

            <div className="space-y-4">
              {works.map((work) => (
                <div
                  key={`${work.project}-${work.client}`}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {work.project}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {work.client} - {work.location}
                      </p>
                    </div>
                    <div className="rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
                      {work.progress}%
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {work.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Budget: {formatCurrency(work.budget)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Finance Summary
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Billing, advance, and balance overview
            </h2>

            <div className="mt-6 grid gap-4">
              {financeSummary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Raw Material Stock
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Material availability
            </h2>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Available</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-sm">
                  {stockItems.map((item) => (
                    <tr key={item.item}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.item}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.available}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Low stock"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Orders and Payments
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Add orders and track down payment, received amount, and balance
            </h2>

            <form
              onSubmit={handleAddOrder}
              className="mt-6 grid gap-4 rounded-[1.5rem] border border-sky-100 bg-sky-50/70 p-5"
            >
              <input
                required
                placeholder="Order ID"
                value={orderForm.orderId}
                onChange={(event) =>
                  setOrderForm((current) => ({ ...current, orderId: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                placeholder="Client name"
                value={orderForm.client}
                onChange={(event) =>
                  setOrderForm((current) => ({ ...current, client: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                type="number"
                min="0"
                placeholder="Total order amount"
                value={orderForm.totalAmount}
                onChange={(event) =>
                  setOrderForm((current) => ({ ...current, totalAmount: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                type="number"
                min="0"
                placeholder="Down payment / advance"
                value={orderForm.advancePaid}
                onChange={(event) =>
                  setOrderForm((current) => ({ ...current, advancePaid: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                type="number"
                min="0"
                placeholder="Total payment received"
                value={orderForm.receivedAmount}
                onChange={(event) =>
                  setOrderForm((current) => ({ ...current, receivedAmount: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <input
                required
                placeholder="Payment status"
                value={orderForm.paymentStatus}
                onChange={(event) =>
                  setOrderForm((current) => ({ ...current, paymentStatus: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Add Order and Payment
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {order.orderId}
                      </h3>
                      <p className="text-sm text-slate-600">{order.client}</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Advance: {formatCurrency(order.advancePaid)}</p>
                    <p>Received: {formatCurrency(order.receivedAmount)}</p>
                    <p>Remaining: {formatCurrency(order.remainingAmount)}</p>
                    <p>Status: {order.paymentStatus}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700">
                      Down payment tracked
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                      Balance tracked
                    </span>
                    <button
                      type="button"
                      onClick={() => markPaymentReceived(order.orderId)}
                      className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white"
                    >
                      Mark New Payment Received
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
            Completed Works
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Recently delivered projects
          </h2>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Completed On</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {completedWorks.map((work) => (
                  <tr key={work.project}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {work.project}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{work.client}</td>
                    <td className="px-4 py-3 text-slate-600">{work.completedOn}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatCurrency(work.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
