"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  completedWorks as demoCompletedWorks,
  orderPayments as demoOrderPayments,
  runningWorks as demoRunningWorks,
  stockItems as demoStockItems,
  type CompletedWork,
  type OrderPayment,
  type RunningWork,
  type StockItem,
} from "@/data/admin-data";
import { company } from "@/data/site-content";
import {
  websiteProducts as demoProducts,
  websiteWorks as demoWebsiteWorks,
  type Product,
  type WebWork,
} from "@/data/web-catalog";
import type { DashboardSnapshot } from "@/lib/dashboard-data";

const SESSION_KEY = "safepath-admin-session";

type DashboardApiResponse = {
  ok: boolean;
  message?: string;
  mongoConfigured?: boolean;
  products?: Product[];
  websiteWorks?: WebWork[];
  runningWorks?: RunningWork[];
  completedWorks?: CompletedWork[];
  orderPayments?: OrderPayment[];
  stockItems?: StockItem[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const initialWorkForm = { project: "", client: "", location: "", status: "", progress: "0", budget: "" };
const initialOrderForm = {
  orderId: "",
  client: "",
  totalAmount: "",
  advancePaid: "",
  receivedAmount: "",
  paymentStatus: "",
};
const initialProductForm = {
  slug: "",
  name: "",
  category: "",
  image: "/images/highway-guidance.svg",
  shortDescription: "",
  description: "",
  size: "",
  weight: "",
  pricing: "",
  material: "",
  thickness: "",
  visibility: "",
  warranty: "",
  bestFor: "",
  features: "",
};
const initialWebsiteWorkForm = {
  title: "",
  client: "",
  location: "",
  productSlug: "",
  status: "",
  summary: "",
};

type AdminDashboardProps = {
  initialSnapshot?: Partial<DashboardSnapshot> & { mongoConfigured?: boolean };
};

export function AdminDashboard({ initialSnapshot }: AdminDashboardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [works, setWorks] = useState<RunningWork[]>(initialSnapshot?.runningWorks ?? demoRunningWorks);
  const [completedJobs, setCompletedJobs] = useState<CompletedWork[]>(initialSnapshot?.completedWorks ?? demoCompletedWorks);
  const [orders, setOrders] = useState<OrderPayment[]>(initialSnapshot?.orderPayments ?? demoOrderPayments);
  const [inventory, setInventory] = useState<StockItem[]>(initialSnapshot?.stockItems ?? demoStockItems);
  const [products, setProducts] = useState<Product[]>(initialSnapshot?.products ?? demoProducts);
  const [websiteVisibleWorks, setWebsiteVisibleWorks] = useState<WebWork[]>(initialSnapshot?.websiteWorks ?? demoWebsiteWorks);
  const [syncMessage, setSyncMessage] = useState("");
  const [mongoConfigured, setMongoConfigured] = useState(initialSnapshot?.mongoConfigured ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [workForm, setWorkForm] = useState(initialWorkForm);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [websiteWorkForm, setWebsiteWorkForm] = useState(initialWebsiteWorkForm);

  function applySnapshot(snapshot: DashboardApiResponse) {
    if (Array.isArray(snapshot.products)) {
      setProducts(snapshot.products);
    }

    if (Array.isArray(snapshot.websiteWorks)) {
      setWebsiteVisibleWorks(snapshot.websiteWorks);
    }

    if (Array.isArray(snapshot.runningWorks)) {
      setWorks(snapshot.runningWorks);
    }

    if (Array.isArray(snapshot.completedWorks)) {
      setCompletedJobs(snapshot.completedWorks);
    }

    if (Array.isArray(snapshot.orderPayments)) {
      setOrders(snapshot.orderPayments);
    }

    if (Array.isArray(snapshot.stockItems)) {
      setInventory(snapshot.stockItems);
    }

    if (typeof snapshot.mongoConfigured === "boolean") {
      setMongoConfigured(snapshot.mongoConfigured);
    }
  }

  async function loadDashboardData() {
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const data = (await response.json()) as DashboardApiResponse;
      applySnapshot(data);

      if (data.message) {
        setSyncMessage(data.message);
      } else if (data.mongoConfigured) {
        setSyncMessage("Dashboard data is connected to MongoDB.");
      }
    } catch {
      setSyncMessage("MongoDB could not be reached, so the dashboard is showing demo data for now.");
    } finally {
      setReady(true);
    }
  }

  async function persistDashboardAction(action: string, payload?: unknown) {
    setIsSaving(true);

    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, payload }),
      });

      const data = (await response.json()) as DashboardApiResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to save data to MongoDB.");
      }

      applySnapshot(data);
      setSyncMessage(data.message || "Changes saved to MongoDB successfully.");
      return true;
    } catch (error) {
      setSyncMessage(
        error instanceof Error ? error.message : "Unable to save data to MongoDB.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session !== "active") {
      router.replace("/admin/login");
      return;
    }

    void loadDashboardData();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    router.push("/admin/login");
  }

  async function handleAddWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextWork: RunningWork = {
      project: workForm.project,
      client: workForm.client,
      location: workForm.location,
      status: workForm.status,
      progress: Number(workForm.progress || 0),
      budget: Number(workForm.budget || 0),
    };

    const wasSaved = await persistDashboardAction("addRunningWork", nextWork);

    if (wasSaved) {
      setWorkForm(initialWorkForm);
    }
  }

  async function handleAddOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const totalAmount = Number(orderForm.totalAmount || 0);
    const receivedAmount = Number(orderForm.receivedAmount || 0);
    const nextOrder: OrderPayment = {
      orderId: orderForm.orderId,
      client: orderForm.client,
      totalAmount,
      advancePaid: Number(orderForm.advancePaid || 0),
      receivedAmount,
      remainingAmount: Math.max(totalAmount - receivedAmount, 0),
      paymentStatus: orderForm.paymentStatus,
    };

    const wasSaved = await persistDashboardAction("addOrderPayment", nextOrder);

    if (wasSaved) {
      setOrderForm(initialOrderForm);
    }
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug =
      productForm.slug.trim() ||
      productForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const nextProduct: Product = {
      slug,
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      image: productForm.image,
      gallery: [productForm.image, productForm.image, productForm.image],
      shortDescription: productForm.shortDescription.trim(),
      description: productForm.description.trim(),
      size: productForm.size.trim(),
      weight: productForm.weight.trim(),
      pricing: productForm.pricing.trim(),
      material: productForm.material.trim(),
      thickness: productForm.thickness.trim(),
      visibility: productForm.visibility.trim(),
      warranty: productForm.warranty.trim(),
      bestFor: productForm.bestFor.split(",").map((item) => item.trim()).filter(Boolean),
      features: productForm.features.split(",").map((item) => item.trim()).filter(Boolean),
      realProjects: [],
    };

    const wasSaved = await persistDashboardAction("addProduct", nextProduct);

    if (wasSaved) {
      setProductForm(initialProductForm);
    }
  }

  async function handleAddWebsiteWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextWork: WebWork = {
      id: `${websiteWorkForm.productSlug}-${Date.now()}`,
      title: websiteWorkForm.title.trim(),
      client: websiteWorkForm.client.trim(),
      location: websiteWorkForm.location.trim(),
      productSlug: websiteWorkForm.productSlug,
      status: websiteWorkForm.status.trim(),
      summary: websiteWorkForm.summary.trim(),
    };

    const wasSaved = await persistDashboardAction("addWebsiteWork", nextWork);

    if (wasSaved) {
      setWebsiteWorkForm(initialWebsiteWorkForm);
    }
  }

  async function removeProduct(slug: string) {
    await persistDashboardAction("removeProduct", { slug });
  }

  async function removeWebsiteWork(id: string) {
    await persistDashboardAction("removeWebsiteWork", { id });
  }

  async function markPaymentReceived(orderId: string) {
    await persistDashboardAction("markPaymentReceived", { orderId });
  }

  const stats = useMemo(
    () => [
      { label: "Website Products", value: String(products.length), note: "Visible on the website" },
      { label: "Website Works", value: String(websiteVisibleWorks.length), note: "Same portfolio shown on the front page" },
      { label: "Running Works", value: String(works.length), note: `${works.filter((item) => item.progress < 100).length} internal active jobs` },
      {
        label: "Outstanding Payments",
        value: formatCurrency(orders.reduce((sum, item) => sum + item.remainingAmount, 0)),
        note: "Commercial follow-up in progress",
      },
    ],
    [orders, products.length, websiteVisibleWorks.length, works],
  );

  const financeSummary = [
    { label: "Current Running Budget", value: formatCurrency(works.reduce((sum, item) => sum + item.budget, 0)) },
    { label: "Payments Received", value: formatCurrency(orders.reduce((sum, item) => sum + item.receivedAmount, 0)) },
    { label: "Outstanding Payments", value: formatCurrency(orders.reduce((sum, item) => sum + item.remainingAmount, 0)) },
    { label: "Advance Collected", value: formatCurrency(orders.reduce((sum, item) => sum + item.advancePaid, 0)) },
  ];

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Loading dashboard...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-xs font-black text-white">
                AKB
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Admin Dashboard</p>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Manage {company.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Control website products and portfolio, track operations, orders, and project timelines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/" className="rounded-full border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">View Website</a>
            <button onClick={handleLogout} className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>

     

      <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
              <p className="mt-3 text-sm text-orange-600 font-medium">{item.note}</p>
            </div>
          ))}
        </section>

        <div className="rounded-[1.5rem] border border-orange-100 bg-orange-50 px-5 py-4 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Database status:</span>{" "}
          {syncMessage || (mongoConfigured
            ? "Products and website works are loading from MongoDB."
            : "MongoDB is not configured, so demo data is being shown.")}
          {isSaving ? " Saving latest changes..." : ""}
        </div>

        <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Website Content</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Add or remove products and works shown on the web app</h2>
          <div className="mt-6 grid gap-8 xl:grid-cols-2">
            <form onSubmit={handleAddProduct} className="grid gap-4 rounded-[1.75rem] border border-orange-100 bg-orange-50/70 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Add Product</h3>
              <input required placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <div className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Category" value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                <input placeholder="Slug optional" value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              </div>
              <select value={productForm.image} onChange={(event) => setProductForm((current) => ({ ...current, image: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                <option value="/images/highway-guidance.svg">Highway board image</option>
                <option value="/images/factory-safety.svg">Factory safety image</option>
                <option value="/images/construction-diversion.svg">Construction image</option>
              </select>
              <textarea required rows={3} placeholder="Short description" value={productForm.shortDescription} onChange={(event) => setProductForm((current) => ({ ...current, shortDescription: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <textarea required rows={4} placeholder="Full description" value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <div className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Size range" value={productForm.size} onChange={(event) => setProductForm((current) => ({ ...current, size: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                <input required placeholder="Weight range" value={productForm.weight} onChange={(event) => setProductForm((current) => ({ ...current, weight: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Starting pricing" value={productForm.pricing} onChange={(event) => setProductForm((current) => ({ ...current, pricing: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                <input required placeholder="Material" value={productForm.material} onChange={(event) => setProductForm((current) => ({ ...current, material: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Thickness" value={productForm.thickness} onChange={(event) => setProductForm((current) => ({ ...current, thickness: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                <input required placeholder="Visibility / finish" value={productForm.visibility} onChange={(event) => setProductForm((current) => ({ ...current, visibility: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              </div>
              <input required placeholder="Warranty / support" value={productForm.warranty} onChange={(event) => setProductForm((current) => ({ ...current, warranty: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Best for, comma separated" value={productForm.bestFor} onChange={(event) => setProductForm((current) => ({ ...current, bestFor: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Features, comma separated" value={productForm.features} onChange={(event) => setProductForm((current) => ({ ...current, features: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <button type="submit" className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Add Product to Website</button>
            </form>

            <form onSubmit={handleAddWebsiteWork} className="grid gap-4 rounded-[1.75rem] border border-orange-100 bg-orange-50/70 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Add Website Work</h3>
              <input required placeholder="Work title" value={websiteWorkForm.title} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, title: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <div className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Client" value={websiteWorkForm.client} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                <input required placeholder="Location" value={websiteWorkForm.location} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, location: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              </div>
              <select required value={websiteWorkForm.productSlug} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, productSlug: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                <option value="">Select linked product</option>
                {products.map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)}
              </select>
              <input required placeholder="Status" value={websiteWorkForm.status} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <textarea required rows={4} placeholder="Summary" value={websiteWorkForm.summary} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, summary: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <button type="submit" className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Add Work to Website</button>
            </form>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Products on Website</h3>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{products.length} items</span>
              </div>
              {products.map((product) => (
                <div key={product.slug} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{product.category}</p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
                      <p className="mt-2 text-sm font-medium text-slate-700">{product.pricing}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/products/${product.slug}`} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50">Open Page</Link>
                      <button type="button" onClick={() => void removeProduct(product.slug)} className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Works on Website</h3>
                  <p className="mt-1 text-xs text-slate-500">These are the same MongoDB portfolio items shown on the front page.</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{websiteVisibleWorks.length} items</span>
              </div>
              {websiteVisibleWorks.map((work) => {
                const linkedProduct = products.find((item) => item.slug === work.productSlug);
                return (
                  <div key={work.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{work.title}</h4>
                        <p className="mt-1 text-sm text-slate-600">{work.client} - {work.location}</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{work.summary}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">Linked to: {linkedProduct?.name ?? work.productSlug}</p>
                      </div>
                      <button type="button" onClick={() => void removeWebsiteWork(work.id)} className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Running Works</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Internal project execution tracker</h2>
            <p className="mt-2 text-sm text-slate-500">This section is dashboard-only and separate from the website portfolio list.</p>
            <form onSubmit={handleAddWork} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5 md:grid-cols-2">
              <input required placeholder="Project name" value={workForm.project} onChange={(event) => setWorkForm((current) => ({ ...current, project: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Client name" value={workForm.client} onChange={(event) => setWorkForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Location" value={workForm.location} onChange={(event) => setWorkForm((current) => ({ ...current, location: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Current status" value={workForm.status} onChange={(event) => setWorkForm((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required type="number" min="0" max="100" placeholder="Progress %" value={workForm.progress} onChange={(event) => setWorkForm((current) => ({ ...current, progress: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required type="number" min="0" placeholder="Budget amount" value={workForm.budget} onChange={(event) => setWorkForm((current) => ({ ...current, budget: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <button type="submit" className="md:col-span-2 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Add Internal Work</button>
            </form>
            <div className="mt-6 space-y-4">
              {works.map((work) => (
                <div key={`${work.project}-${work.client}`} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{work.project}</h3>
                      <p className="text-sm text-slate-600">{work.client} - {work.location}</p>
                    </div>
                    <div className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">{work.progress}%</div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">{work.status}</p>
                  <p className="mt-2 text-sm text-slate-500">Budget: {formatCurrency(work.budget)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Finance Summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Billing and balance overview</h2>
              <div className="mt-6 grid gap-4">
                {financeSummary.map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Raw Material Stock</p>
              <div className="mt-5 space-y-3">
                {inventory.map((item) => (
                  <div key={item.item} className="flex items-center justify-between rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{item.item}</p>
                      <p className="text-sm text-slate-600">{item.available}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Low stock" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Orders and Payments</p>
            <form onSubmit={handleAddOrder} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5">
              <input required placeholder="Order ID" value={orderForm.orderId} onChange={(event) => setOrderForm((current) => ({ ...current, orderId: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Client name" value={orderForm.client} onChange={(event) => setOrderForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required type="number" min="0" placeholder="Total amount" value={orderForm.totalAmount} onChange={(event) => setOrderForm((current) => ({ ...current, totalAmount: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required type="number" min="0" placeholder="Advance" value={orderForm.advancePaid} onChange={(event) => setOrderForm((current) => ({ ...current, advancePaid: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required type="number" min="0" placeholder="Received" value={orderForm.receivedAmount} onChange={(event) => setOrderForm((current) => ({ ...current, receivedAmount: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <input required placeholder="Payment status" value={orderForm.paymentStatus} onChange={(event) => setOrderForm((current) => ({ ...current, paymentStatus: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
              <button type="submit" className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Add Order and Payment</button>
            </form>
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order.orderId} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{order.orderId}</h3>
                      <p className="text-sm text-slate-600">{order.client}</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Advance: {formatCurrency(order.advancePaid)}</p>
                    <p>Received: {formatCurrency(order.receivedAmount)}</p>
                    <p>Remaining: {formatCurrency(order.remainingAmount)}</p>
                    <p>Status: {order.paymentStatus}</p>
                  </div>
                  <button type="button" onClick={() => void markPaymentReceived(order.orderId)} className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">Mark New Payment Received</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Completed Works</p>
            <div className="mt-5 space-y-4">
              {completedJobs.map((work) => (
                <div key={work.project} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{work.project}</h3>
                  <p className="mt-1 text-sm text-slate-600">{work.client}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>Completed: {work.completedOn}</span>
                    <span>Value: {formatCurrency(work.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
