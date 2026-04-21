"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
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

type DashboardView =
  | "dashboard"
  | "runningWorks"
  | "completedWorks"
  | "orders"
  | "websiteWorks"
  | "products";

type AdminDashboardProps = {
  initialSnapshot?: Partial<DashboardSnapshot> & { mongoConfigured?: boolean };
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const toMoney = (value: string | number) => {
  const amount = Number(value || 0);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
};

const buildPaymentStatus = (receivedAmount: number, totalAmount: number) => {
  if (totalAmount <= 0) {
    return "No payment amount set";
  }

  if (receivedAmount <= 0) {
    return "Payment pending";
  }

  if (receivedAmount >= totalAmount) {
    return "Payment completed";
  }

  return `${Math.round((receivedAmount / totalAmount) * 100)}% amount received`;
};

const formatDisplayDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateWarrantyValidTill = (completedOn: string, warrantyMonths: number) => {
  const parsed = new Date(completedOn);

  if (Number.isNaN(parsed.getTime())) {
    return completedOn;
  }

  parsed.setMonth(parsed.getMonth() + warrantyMonths);
  return parsed.toISOString().slice(0, 10);
};

const initialWorkForm = {
  project: "",
  client: "",
  location: "",
  status: "",
  progress: "0",
  budget: "",
  startDate: "",
  expectedEndDate: "",
  totalAmount: "",
  advancePaid: "",
  receivedAmount: "",
  warrantyMonths: "12",
};
const initialCompletedWorkForm = {
  project: "",
  client: "",
  completedOn: "",
  value: "",
  warrantyMonths: "12",
};
const initialWorkPaymentForm = { amount: "" };
const initialOrderPaymentAddForm = { amount: "" };
const initialStockAdjustmentForm = { amount: "" };
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
  image: "",
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
  image: "",
  productSlug: "",
  status: "",
  summary: "",
};

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

export function AdminDashboard({ initialSnapshot }: AdminDashboardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showCompletedWorkForm, setShowCompletedWorkForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showWebsiteWorkForm, setShowWebsiteWorkForm] = useState(false);
  const [selectedWorkKey, setSelectedWorkKey] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedStockItem, setSelectedStockItem] = useState("");
  const [editingCompletedWorkRef, setEditingCompletedWorkRef] = useState<{ project: string; client: string } | null>(null);
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null);
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
  const [completedWorkForm, setCompletedWorkForm] = useState(initialCompletedWorkForm);
  const [workPaymentForm, setWorkPaymentForm] = useState(initialWorkPaymentForm);
  const [orderPaymentAddForm, setOrderPaymentAddForm] = useState(initialOrderPaymentAddForm);
  const [stockAdjustmentForm, setStockAdjustmentForm] = useState(initialStockAdjustmentForm);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [websiteWorkForm, setWebsiteWorkForm] = useState(initialWebsiteWorkForm);

  async function handleProductImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setProductForm((current) => ({ ...current, image: "" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSyncMessage("Please choose a valid image file for the product.");
      event.target.value = "";
      return;
    }

    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }

          reject(new Error("Unable to read the selected image."));
        };

        reader.onerror = () => reject(new Error("Unable to read the selected image."));
        reader.readAsDataURL(file);
      });

      setProductForm((current) => ({ ...current, image: imageData }));
      setSyncMessage(`Selected product image: ${file.name}`);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Unable to read the selected image.");
    }
  }

  async function handleWebsiteWorkImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setWebsiteWorkForm((current) => ({ ...current, image: "" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSyncMessage("Please choose a valid image file for the website work.");
      event.target.value = "";
      return;
    }

    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }

          reject(new Error("Unable to read the selected image."));
        };

        reader.onerror = () => reject(new Error("Unable to read the selected image."));
        reader.readAsDataURL(file);
      });

      setWebsiteWorkForm((current) => ({ ...current, image: imageData }));
      setSyncMessage(`Selected website work image: ${file.name}`);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Unable to read the selected image.");
    }
  }

  function startEditingCompletedWork(work: CompletedWork) {
    setEditingCompletedWorkRef({ project: work.project, client: work.client });
    setShowCompletedWorkForm(true);
    setCompletedWorkForm({
      project: work.project,
      client: work.client,
      completedOn: work.completedOn,
      value: String(work.value),
      warrantyMonths: String(work.warrantyMonths),
    });
  }

  function resetCompletedWorkEditor() {
    setCompletedWorkForm(initialCompletedWorkForm);
    setEditingCompletedWorkRef(null);
    setShowCompletedWorkForm(false);
  }

  function startEditingProduct(product: Product) {
    setProductForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      shortDescription: product.shortDescription,
      description: product.description,
      size: product.size,
      weight: product.weight,
      pricing: product.pricing,
      material: product.material,
      thickness: product.thickness,
      visibility: product.visibility,
      warranty: product.warranty,
      bestFor: product.bestFor.join(", "),
      features: product.features.join(", "),
    });
    setEditingProductSlug(product.slug);
    setShowProductForm(true);
  }

  function resetProductEditor() {
    setProductForm(initialProductForm);
    setEditingProductSlug(null);
    setShowProductForm(false);
  }

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

    const totalAmount = toMoney(workForm.totalAmount);
    const advancePaid = toMoney(workForm.advancePaid);
    const receivedAmount = Math.max(toMoney(workForm.receivedAmount), advancePaid);

    if (receivedAmount > totalAmount) {
      setSyncMessage("Received amount cannot be greater than total work amount.");
      return;
    }

    const nextWork: RunningWork = {
      project: workForm.project,
      client: workForm.client,
      location: workForm.location,
      status: workForm.status,
      progress: Number(workForm.progress || 0),
      budget: toMoney(workForm.budget),
      startDate: workForm.startDate,
      expectedEndDate: workForm.expectedEndDate,
      totalAmount,
      advancePaid,
      receivedAmount,
      remainingAmount: Math.max(totalAmount - receivedAmount, 0),
      warrantyMonths: Number(workForm.warrantyMonths || 0),
    };

    const wasSaved = await persistDashboardAction("addRunningWork", nextWork);

    if (wasSaved) {
      setWorkForm(initialWorkForm);
      setShowWorkForm(false);
    }
  }

  async function handleAddCompletedWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const warrantyMonths = Math.max(Number(completedWorkForm.warrantyMonths || 0), 1);
    const completedOn = completedWorkForm.completedOn;
    const warrantyValidTill = calculateWarrantyValidTill(completedOn, warrantyMonths);

    if (!completedOn) {
      setSyncMessage("Completed date is required.");
      return;
    }

    const nextCompletedWork: CompletedWork = {
      project: completedWorkForm.project,
      client: completedWorkForm.client,
      completedOn,
      value: Number(completedWorkForm.value || 0),
      warrantyMonths,
      warrantyStartOn: completedOn,
      warrantyValidTill,
    };

    const wasSaved = editingCompletedWorkRef
      ? await persistDashboardAction("updateCompletedWork", {
        originalProject: editingCompletedWorkRef.project,
        originalClient: editingCompletedWorkRef.client,
        work: nextCompletedWork,
      })
      : await persistDashboardAction("addCompletedWork", nextCompletedWork);

    if (wasSaved) {
      resetCompletedWorkEditor();
    }
  }

  async function handleAddOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const totalAmount = toMoney(orderForm.totalAmount);
    const advancePaid = toMoney(orderForm.advancePaid);
    const receivedAmount = Math.max(toMoney(orderForm.receivedAmount), advancePaid);

    if (receivedAmount > totalAmount) {
      setSyncMessage("Received amount cannot be greater than total order amount.");
      return;
    }

    const nextOrder: OrderPayment = {
      orderId: orderForm.orderId,
      client: orderForm.client,
      totalAmount,
      advancePaid,
      receivedAmount,
      remainingAmount: Math.max(totalAmount - receivedAmount, 0),
      paymentStatus: buildPaymentStatus(receivedAmount, totalAmount),
    };

    const wasSaved = await persistDashboardAction("addOrderPayment", nextOrder);

    if (wasSaved) {
      setOrderForm(initialOrderForm);
      setShowOrderForm(false);
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
      image: productForm.image.trim(),
      gallery: productForm.image.trim() ? [productForm.image.trim()] : [],
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

    const action = editingProductSlug ? "updateProduct" : "addProduct";
    const payload = editingProductSlug
      ? { originalSlug: editingProductSlug, product: nextProduct }
      : nextProduct;

    const wasSaved = await persistDashboardAction(action, payload);

    if (wasSaved) {
      resetProductEditor();
    }
  }

  async function handleAddWebsiteWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextWork: WebWork = {
      id: `${websiteWorkForm.productSlug}-${Date.now()}`,
      title: websiteWorkForm.title.trim(),
      client: websiteWorkForm.client.trim(),
      location: websiteWorkForm.location.trim(),
      image: websiteWorkForm.image.trim(),
      productSlug: websiteWorkForm.productSlug,
      status: websiteWorkForm.status.trim(),
      summary: websiteWorkForm.summary.trim(),
    };

    const wasSaved = await persistDashboardAction("addWebsiteWork", nextWork);

    if (wasSaved) {
      setWebsiteWorkForm(initialWebsiteWorkForm);
      setShowWebsiteWorkForm(false);
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

  async function handleAddRunningWorkPayment(work: RunningWork) {
    const amount = toMoney(workPaymentForm.amount);

    if (amount <= 0) {
      setSyncMessage("Payment amount must be greater than zero.");
      return;
    }

    if (amount > work.remainingAmount) {
      setSyncMessage("Payment amount cannot be greater than remaining amount.");
      return;
    }

    const wasSaved = await persistDashboardAction("addRunningWorkPayment", {
      project: work.project,
      client: work.client,
      amount,
    });

    if (wasSaved) {
      setWorkPaymentForm(initialWorkPaymentForm);
    }
  }

  async function handleAddOrderReceivedPayment(order: OrderPayment) {
    const amount = toMoney(orderPaymentAddForm.amount);

    if (amount <= 0) {
      setSyncMessage("Payment amount must be greater than zero.");
      return;
    }

    if (amount > order.remainingAmount) {
      setSyncMessage("Payment amount cannot be greater than remaining amount.");
      return;
    }

    const wasSaved = await persistDashboardAction("addOrderReceivedPayment", {
      orderId: order.orderId,
      amount,
    });

    if (wasSaved) {
      setOrderPaymentAddForm(initialOrderPaymentAddForm);
      setSelectedOrderId(order.orderId);
    }
  }

  async function handleAdjustStock(item: StockItem, mode: "use" | "add") {
    const amount = toMoney(stockAdjustmentForm.amount);

    if (amount <= 0) {
      setSyncMessage("Stock adjustment amount must be greater than zero.");
      return;
    }

    if (mode === "use" && amount > item.quantity) {
      setSyncMessage("Used quantity cannot be greater than available stock.");
      return;
    }

    const wasSaved = await persistDashboardAction("adjustStockItem", {
      item: item.item,
      adjustment: mode === "use" ? -amount : amount,
    });

    if (wasSaved) {
      setStockAdjustmentForm(initialStockAdjustmentForm);
      setSelectedStockItem("");
    }
  }

  const outstandingPayments = orders.reduce((sum, item) => sum + item.remainingAmount, 0);
  const receivedPayments = orders.reduce((sum, item) => sum + item.receivedAmount, 0);
  const runningBudget = works.reduce((sum, item) => sum + item.budget, 0);
  const lowStockCount = inventory.filter((item) => item.status === "Low stock").length;
  const activeWorkCount = works.filter((item) => item.progress < 100).length;
  const completedWorkCount = completedJobs.length;
  const unpaidOrderCount = orders.filter((item) => item.remainingAmount > 0).length;
  const selectedWork =
    works.find((work) => `${work.project}-${work.client}` === selectedWorkKey) ?? null;
  const workFormAdvance = toMoney(workForm.advancePaid);
  const workFormTotal = toMoney(workForm.totalAmount);
  const workFormReceived = Math.max(toMoney(workForm.receivedAmount), workFormAdvance);
  const workFormRemaining = Math.max(workFormTotal - workFormReceived, 0);
  const orderFormAdvance = toMoney(orderForm.advancePaid);
  const orderFormTotal = toMoney(orderForm.totalAmount);
  const orderFormReceived = Math.max(toMoney(orderForm.receivedAmount), orderFormAdvance);
  const orderFormRemaining = Math.max(orderFormTotal - orderFormReceived, 0);
  const orderFormStatus = buildPaymentStatus(orderFormReceived, orderFormTotal);

  const navItems: Array<{ key: DashboardView; label: string; note: string }> = [
    { key: "dashboard", label: "Dashboard", note: "Daily summary" },
    { key: "runningWorks", label: "Running Works", note: "Track live jobs" },
    { key: "completedWorks", label: "Completed Works", note: "Warranty and service dates" },
    { key: "orders", label: "Orders & Payments", note: "Billing and collections" },
    { key: "websiteWorks", label: "Website Works", note: "Portfolio shown online" },
    { key: "products", label: "Products", note: "Website product catalog" },
  ];

  const dashboardCards = useMemo(
    () => [
      { label: "Continuing Works", value: String(activeWorkCount), note: "Internal jobs currently in progress" },
      { label: "Outstanding Payments", value: formatCurrency(outstandingPayments), note: `${unpaidOrderCount} orders need follow-up` },
      { label: "Work Status", value: `${completedWorkCount} closed`, note: `${works.length} total tracked projects` },
      { label: "Raw Material Alerts", value: String(lowStockCount), note: `${inventory.length} stock lines being monitored` },
    ],
    [activeWorkCount, completedWorkCount, inventory.length, lowStockCount, outstandingPayments, unpaidOrderCount, works.length],
  );

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
                ME
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Admin Dashboard</p>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Manage {company.name}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              The dashboard now stays focused on daily-use information, while website content and data entry live in the sidebar sections.
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

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="lg:sticky lg:top-8 lg:h-fit lg:w-72">
          <div className="rounded-[2rem] border border-white bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-600 to-red-600 px-5 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-100">Workspace</p>
              <p className="mt-2 text-xl font-semibold">Cleaner admin navigation</p>
              <p className="mt-2 text-sm leading-6 text-orange-50">Use these sections to manage website items, running works, and payments without crowding the dashboard.</p>
            </div>

            <nav className="mt-4 space-y-2">
              {navItems.map((item) => {
                const isActive = activeView === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveView(item.key)}
                    className={`w-full rounded-[1.25rem] px-4 py-3 text-left transition ${
                      isActive ? "bg-orange-50 text-orange-700" : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className={`mt-1 text-xs ${isActive ? "text-orange-600" : "text-slate-500"}`}>{item.note}</p>
                  </button>
                );
              })}
            </nav>

            
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {activeView === "dashboard" ? (
            <div className="space-y-8">
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {dashboardCards.map((item) => (
                  <div key={item.label} className="rounded-[1.75rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                    <p className="mt-3 text-sm font-medium text-orange-600">{item.note}</p>
                  </div>
                ))}
              </section>

              <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                  <SectionHeading
                    eyebrow="Daily Operations"
                    title="Continuing works"
                    description="This page shows the work items your team needs every day. Add or edit work items from the Running Works section in the sidebar."
                  />
                  <div className="mt-6 space-y-4">
                    {works.length ? works.map((work) => (
                      <div key={`${work.project}-${work.client}`} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{work.project}</h3>
                            <p className="text-sm text-slate-600">{work.client} - {work.location}</p>
                          </div>
                          <div className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
                            {work.progress}%
                          </div>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-slate-200">
                          <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${Math.min(work.progress, 100)}%` }} />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                          <span>Status: {work.status}</span>
                          <span>Budget: {formatCurrency(work.budget)}</span>
                        </div>
                      </div>
                    )) : <EmptyState message="No running works are available yet." />}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                    <SectionHeading
                      eyebrow="Payments"
                      title="Collection overview"
                      description="Orders and payment records are visible here for quick review. Use the Orders & Payments section to add new records."
                    />
                    <div className="mt-6 grid gap-4">
                      <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                        <p className="text-sm text-slate-500">Payments Received</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(receivedPayments)}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                        <p className="text-sm text-slate-500">Outstanding Payments</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(outstandingPayments)}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                        <p className="text-sm text-slate-500">Current Running Budget</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(runningBudget)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                    <SectionHeading
                      eyebrow="Raw Material"
                      title="Stock alerts"
                      description="Keep an eye on raw material availability from the main dashboard."
                    />
                    <div className="mt-5 space-y-3">
                      {inventory.length ? inventory.map((item) => (
                        <div key={item.item} className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
                          <button type="button" onClick={() => setSelectedStockItem((current) => current === item.item ? "" : item.item)} className="flex w-full items-center justify-between text-left">
                            <div>
                              <p className="font-medium text-slate-900">{item.item}</p>
                              <p className="text-sm text-slate-600">{item.quantity} {item.unit}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Low stock" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>{item.status}</span>
                          </button>

                          {selectedStockItem === item.item ? (
                            <div className="mt-4 rounded-[1rem] border border-orange-100 bg-white p-4">
                              <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                <p>Available: {item.quantity} {item.unit}</p>
                                <p>Reorder level: {item.reorderLevel} {item.unit}</p>
                              </div>
                              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <input type="number" min="0" placeholder={`Quantity in ${item.unit}`} value={stockAdjustmentForm.amount} onChange={(event) => setStockAdjustmentForm({ amount: event.target.value })} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                                <button type="button" onClick={() => void handleAdjustStock(item, "use")} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">Use Material</button>
                                <button type="button" onClick={() => void handleAdjustStock(item, "add")} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Add Stock</button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )) : <EmptyState message="No stock items are available yet." />}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-8 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                  <SectionHeading
                    eyebrow="Orders"
                    title="Orders and payments"
                    description="Quick payment visibility stays on the dashboard, but the add form now opens only inside the Orders & Payments page."
                  />
                  <div className="mt-6 space-y-4">
                    {orders.length ? orders.map((order) => (
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
                      </div>
                    )) : <EmptyState message="No orders or payment records are available yet." />}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                  <SectionHeading
                    eyebrow="Work Status"
                    title="Completed work history"
                    description="Closed jobs stay visible here so the dashboard still gives a full status picture."
                  />
                  <div className="mt-5 space-y-4">
                    {completedJobs.length ? completedJobs.map((work) => (
                      <div key={work.project} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                        <h3 className="text-lg font-semibold text-slate-900">{work.project}</h3>
                        <p className="mt-1 text-sm text-slate-600">{work.client}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                          <span>Completed: {formatDisplayDate(work.completedOn)}</span>
                          <span>Value: {formatCurrency(work.value)}</span>
                          <span>Warranty till: {formatDisplayDate(work.warrantyValidTill)}</span>
                        </div>
                      </div>
                    )) : <EmptyState message="No completed works are available yet." />}
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {activeView === "runningWorks" ? (
            <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <SectionHeading
                eyebrow="Running Works"
                title="Manage internal project execution"
                description="Click any running work to open full project details, payment tracking, and a direct add-payment action that updates MongoDB."
                action={
                  <button type="button" onClick={() => setShowWorkForm((current) => !current)} className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">
                    {showWorkForm ? "Close Form" : "Add Running Work"}
                  </button>
                }
              />

              {showWorkForm ? (
                <form onSubmit={handleAddWork} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5 md:grid-cols-2">
                  <input required placeholder="Project name" value={workForm.project} onChange={(event) => setWorkForm((current) => ({ ...current, project: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required placeholder="Client name" value={workForm.client} onChange={(event) => setWorkForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required placeholder="Location" value={workForm.location} onChange={(event) => setWorkForm((current) => ({ ...current, location: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required placeholder="Current status" value={workForm.status} onChange={(event) => setWorkForm((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" max="100" placeholder="Progress %" value={workForm.progress} onChange={(event) => setWorkForm((current) => ({ ...current, progress: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Budget amount" value={workForm.budget} onChange={(event) => setWorkForm((current) => ({ ...current, budget: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="date" value={workForm.startDate} onChange={(event) => setWorkForm((current) => ({ ...current, startDate: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="date" value={workForm.expectedEndDate} onChange={(event) => setWorkForm((current) => ({ ...current, expectedEndDate: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Total work amount" value={workForm.totalAmount} onChange={(event) => setWorkForm((current) => ({ ...current, totalAmount: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Advance paid" value={workForm.advancePaid} onChange={(event) => setWorkForm((current) => ({ ...current, advancePaid: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Received payment" value={workForm.receivedAmount} onChange={(event) => setWorkForm((current) => ({ ...current, receivedAmount: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Warranty period in months" value={workForm.warrantyMonths} onChange={(event) => setWorkForm((current) => ({ ...current, warrantyMonths: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <div className="md:col-span-2 rounded-2xl border border-dashed border-orange-200 bg-white px-4 py-3 text-sm text-slate-600">
                    <div className="flex flex-wrap gap-4">
                      <span>Received considered: {formatCurrency(workFormReceived)}</span>
                      <span>Remaining: {formatCurrency(workFormRemaining)}</span>
                    </div>
                  </div>
                  <button type="submit" className="md:col-span-2 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Save Running Work</button>
                </form>
              ) : null}

              <div className="mt-6 space-y-4">
                {works.length ? works.map((work) => (
                  <div key={`${work.project}-${work.client}`} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                    <button type="button" onClick={() => setSelectedWorkKey((current) => current === `${work.project}-${work.client}` ? "" : `${work.project}-${work.client}`)} className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{work.project}</h3>
                        <p className="text-sm text-slate-600">{work.client} - {work.location}</p>
                      </div>
                      <div className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">{work.progress}%</div>
                    </button>
                    <p className="mt-4 text-sm font-medium text-slate-700">{work.status}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span>Budget: {formatCurrency(work.budget)}</span>
                      <span>Remaining: {formatCurrency(work.remainingAmount)}</span>
                      <span>Expected end: {formatDisplayDate(work.expectedEndDate)}</span>
                    </div>

                    {selectedWorkKey === `${work.project}-${work.client}` ? (
                      <div className="mt-5 grid gap-5 rounded-[1.25rem] border border-orange-100 bg-white p-5 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Work done</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{work.progress}%</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Start date</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{formatDisplayDate(work.startDate)}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Expected ending</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{formatDisplayDate(work.expectedEndDate)}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Warranty</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{work.warrantyMonths} months</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total payment</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(work.totalAmount)}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Advance</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(work.advancePaid)}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Received</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(work.receivedAmount)}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Remaining</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(work.remainingAmount)}</p>
                          </div>
                        </div>

                        <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-900">Add received payment</p>
                          <p className="mt-1 text-sm text-slate-500">This updates the running work record directly in MongoDB.</p>
                          <div className="mt-4 space-y-3">
                            <input type="number" min="0" placeholder="Payment amount" value={selectedWork?.project === work.project && selectedWork?.client === work.client ? workPaymentForm.amount : ""} onChange={(event) => setWorkPaymentForm({ amount: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                            <button type="button" onClick={() => void handleAddRunningWorkPayment(work)} className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Add Payment</button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )) : <EmptyState message="No running works are available yet." />}
              </div>
            </section>
          ) : null}

          {activeView === "completedWorks" ? (
            <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <SectionHeading
                eyebrow="Completed Works"
                title="Warranty and service tracking"
                description="Add completed projects here. Warranty starts from the project completion date and the valid-till date is calculated automatically."
                action={
                  <button type="button" onClick={() => showCompletedWorkForm ? resetCompletedWorkEditor() : setShowCompletedWorkForm(true)} className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">
                    {showCompletedWorkForm ? "Close Form" : "Add Completed Work"}
                  </button>
                }
              />

              {showCompletedWorkForm ? (
                <form onSubmit={handleAddCompletedWork} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5 md:grid-cols-2">
                  <input required placeholder="Project name" value={completedWorkForm.project} onChange={(event) => setCompletedWorkForm((current) => ({ ...current, project: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required placeholder="Client name" value={completedWorkForm.client} onChange={(event) => setCompletedWorkForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="date" value={completedWorkForm.completedOn} onChange={(event) => setCompletedWorkForm((current) => ({ ...current, completedOn: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Project value" value={completedWorkForm.value} onChange={(event) => setCompletedWorkForm((current) => ({ ...current, value: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="1" placeholder="Warranty months" value={completedWorkForm.warrantyMonths} onChange={(event) => setCompletedWorkForm((current) => ({ ...current, warrantyMonths: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Completion date: {completedWorkForm.completedOn ? formatDisplayDate(completedWorkForm.completedOn) : "-"}
                  </div>
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Warranty valid till: {completedWorkForm.completedOn ? formatDisplayDate(calculateWarrantyValidTill(completedWorkForm.completedOn, Number(completedWorkForm.warrantyMonths))) : "-"}
                  </div>
                  <button type="submit" className="md:col-span-2 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">{editingCompletedWorkRef ? "Update Completed Work" : "Save Completed Work"}</button>
                </form>
              ) : null}

              <div className="mt-6 space-y-4">
                {completedJobs.length ? completedJobs.map((work) => (
                  <div key={`${work.project}-${work.client}`} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{work.project}</h3>
                        <p className="text-sm text-slate-600">{work.client}</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{formatCurrency(work.value)}</p>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>Completed: {formatDisplayDate(work.completedOn)}</p>
                      <p>Warranty months: {work.warrantyMonths}</p>
                      <p>Warranty start: {formatDisplayDate(work.warrantyStartOn)}</p>
                      <p>Warranty valid till: {formatDisplayDate(work.warrantyValidTill)}</p>
                    </div>
                    <button type="button" onClick={() => startEditingCompletedWork(work)} className="mt-4 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50">Edit Completed Work</button>
                  </div>
                )) : <EmptyState message="No completed works are available yet." />}
              </div>
            </section>
          ) : null}

          {activeView === "orders" ? (
            <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <SectionHeading
                eyebrow="Orders and Payments"
                title="Manage billing records"
                description="This page keeps the form and the list together. Use the button to open the add form only when you need it."
                action={
                  <button type="button" onClick={() => setShowOrderForm((current) => !current)} className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">
                    {showOrderForm ? "Close Form" : "Add Order / Payment"}
                  </button>
                }
              />

              {showOrderForm ? (
                <form onSubmit={handleAddOrder} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5 md:grid-cols-2">
                  <input required placeholder="Order ID" value={orderForm.orderId} onChange={(event) => setOrderForm((current) => ({ ...current, orderId: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required placeholder="Client name" value={orderForm.client} onChange={(event) => setOrderForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Total amount" value={orderForm.totalAmount} onChange={(event) => setOrderForm((current) => ({ ...current, totalAmount: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Advance" value={orderForm.advancePaid} onChange={(event) => setOrderForm((current) => ({ ...current, advancePaid: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input required type="number" min="0" placeholder="Received" value={orderForm.receivedAmount} onChange={(event) => setOrderForm((current) => ({ ...current, receivedAmount: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <input readOnly value={orderFormStatus} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none" />
                  <div className="md:col-span-2 rounded-2xl border border-dashed border-orange-200 bg-white px-4 py-3 text-sm text-slate-600">
                    <div className="flex flex-wrap gap-4">
                      <span>Received considered: {formatCurrency(orderFormReceived)}</span>
                      <span>Remaining: {formatCurrency(orderFormRemaining)}</span>
                      <span>Status: {orderFormStatus}</span>
                    </div>
                  </div>
                  <button type="submit" className="md:col-span-2 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Save Order and Payment</button>
                </form>
              ) : null}

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Received</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(receivedPayments)}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Outstanding</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(outstandingPayments)}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Open Orders</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{unpaidOrderCount}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {orders.length ? orders.map((order) => (
                  <div key={order.orderId} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderId((current) => (current === order.orderId ? "" : order.orderId));
                        setOrderPaymentAddForm(initialOrderPaymentAddForm);
                      }}
                      className="flex w-full flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{order.orderId}</h3>
                        <p className="text-sm text-slate-600">{order.client}</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                    </button>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>Advance: {formatCurrency(order.advancePaid)}</p>
                      <p>Received: {formatCurrency(order.receivedAmount)}</p>
                      <p>Remaining: {formatCurrency(order.remainingAmount)}</p>
                      <p>Status: {order.paymentStatus}</p>
                    </div>

                    {selectedOrderId === order.orderId ? (
                      <div className="mt-5 rounded-[1.25rem] border border-orange-100 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">Add received amount</p>
                        <p className="mt-1 text-sm text-slate-500">This amount will be added to received payment and automatically reduced from remaining amount.</p>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <input type="number" min="0" placeholder="Received amount" value={orderPaymentAddForm.amount} onChange={(event) => setOrderPaymentAddForm({ amount: event.target.value })} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                          <button type="button" onClick={() => void handleAddOrderReceivedPayment(order)} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Add Received Amount</button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )) : <EmptyState message="No orders or payments are available yet." />}
              </div>
            </section>
          ) : null}

          {activeView === "websiteWorks" ? (
            <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <SectionHeading
                eyebrow="Website Works"
                title="Manage website portfolio items"
                description="Website works are now separated from the main dashboard so the overview page stays clean."
                action={
                  <button type="button" onClick={() => setShowWebsiteWorkForm((current) => !current)} className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">
                    {showWebsiteWorkForm ? "Close Form" : "Add Website Work"}
                  </button>
                }
              />

              {showWebsiteWorkForm ? (
                <form onSubmit={handleAddWebsiteWork} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5">
                  <input required placeholder="Work title" value={websiteWorkForm.title} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, title: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input required placeholder="Client" value={websiteWorkForm.client} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, client: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                    <input required placeholder="Location" value={websiteWorkForm.location} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, location: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-semibold text-slate-700">Work image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleWebsiteWorkImageChange(event)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700"
                    />
                    {websiteWorkForm.image ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
                        <img src={websiteWorkForm.image} alt="Website work preview" className="h-40 w-full object-contain" />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Choose an image to store with this website work in the database.</p>
                    )}
                  </div>
                  <select required value={websiteWorkForm.productSlug} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, productSlug: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                    <option value="">Select linked product</option>
                    {products.map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)}
                  </select>
                  <input required placeholder="Status" value={websiteWorkForm.status} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <textarea required rows={4} placeholder="Summary" value={websiteWorkForm.summary} onChange={(event) => setWebsiteWorkForm((current) => ({ ...current, summary: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <button type="submit" className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">Save Website Work</button>
                </form>
              ) : null}

              <div className="mt-6 space-y-4">
                {websiteVisibleWorks.length ? websiteVisibleWorks.map((work) => {
                  const linkedProduct = products.find((item) => item.slug === work.productSlug);

                  return (
                    <div key={work.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          {work.image ? (
                            <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
                              <img src={work.image} alt={work.title} className="h-40 w-full object-cover" />
                            </div>
                          ) : null}
                          <h3 className="text-lg font-semibold text-slate-900">{work.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{work.client} - {work.location}</p>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{work.summary}</p>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">Linked to: {linkedProduct?.name ?? work.productSlug}</p>
                        </div>
                        <button type="button" onClick={() => void removeWebsiteWork(work.id)} className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Remove</button>
                      </div>
                    </div>
                  );
                }) : <EmptyState message="No website work items are available yet." />}
              </div>
            </section>
          ) : null}

          {activeView === "products" ? (
            <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <SectionHeading
                eyebrow="Products"
                title="Manage website product catalog"
                description="Product creation is now moved out of the dashboard into this dedicated sidebar section."
                action={
                  <button
                  type="button"
                  onClick={() => {
                    if (editingProductSlug) {
                      resetProductEditor();
                      return;
                    }

                    setShowProductForm((current) => !current);
                  }}
                  className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700"
                >
                    {showProductForm ? "Close Form" : "Add Product"}
                  </button>
                }
              />

              {showProductForm ? (
                <form onSubmit={handleAddProduct} className="mt-6 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-900">{editingProductSlug ? "Edit Product" : "Add Product"}</h3>
                    {editingProductSlug ? (
                      <button type="button" onClick={resetProductEditor} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                        Cancel edit
                      </button>
                    ) : null}
                  </div>
                  <input required placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input required placeholder="Category" value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                    <input placeholder="Slug optional" value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-semibold text-slate-700">Product image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleProductImageChange(event)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700"
                    />
                    {productForm.image ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
                        <img src={productForm.image} alt="Product preview" className="h-40 w-full object-contain" />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Choose an image to store with this product in the database.</p>
                    )}
                  </div>
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
                  <button type="submit" className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700">{editingProductSlug ? "Save product changes" : "Add Product to Website"}</button>
                </form>
              ) : null}

              <div className="mt-6 space-y-4">
                {products.length ? products.map((product) => (
                  <div key={product.slug} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{product.category}</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
                        <p className="mt-2 text-sm font-medium text-slate-700">{product.pricing}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/products/${product.slug}`} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50">Open Page</Link>
                        <button type="button" onClick={() => startEditingProduct(product)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">Edit</button>
                        <button type="button" onClick={() => void removeProduct(product.slug)} className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Remove</button>
                      </div>
                    </div>
                  </div>
                )) : <EmptyState message="No website products are available yet." />}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
