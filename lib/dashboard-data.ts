import {
  completedWorks as demoCompletedWorks,
  orderPayments as demoOrderPayments,
  runningWorks as demoRunningWorks,
  stockItems as demoStockItems,
  type CompletedWork,
  type OrderPayment,
  type RunningWork,
  type StockItem,
} from "../data/admin-data";
import {
  websiteProducts as demoProducts,
  websiteWorks as demoWebsiteWorks,
  type Product,
  type WebWork,
} from "../data/web-catalog";
import { connectToDatabase, isMongoConfigured } from "./mongodb";
import { CompletedWorkModel } from "../models/CompletedWork";
import { OrderPaymentModel } from "../models/OrderPayment";
import { ProductModel } from "../models/Product";
import { RunningWorkModel } from "../models/RunningWork";
import { StockItemModel } from "../models/StockItem";
import { WebsiteWorkModel } from "../models/WebsiteWork";

export type DashboardSnapshot = {
  products: Product[];
  websiteWorks: WebWork[];
  runningWorks: RunningWork[];
  completedWorks: CompletedWork[];
  orderPayments: OrderPayment[];
  stockItems: StockItem[];
  source: "database" | "demo";
};

export type WebsiteCatalogSnapshot = Pick<DashboardSnapshot, "products" | "websiteWorks" | "source">;

function toPlainData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toMoney(value: unknown) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
}

function toIsoDate(value: unknown) {
  const text = String(value ?? "").trim();

  if (!text) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const parsed = new Date(text);

  if (Number.isNaN(parsed.getTime())) {
    return text;
  }

  return parsed.toISOString().slice(0, 10);
}

function addMonthsToDate(dateValue: string, months: number) {
  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  parsed.setMonth(parsed.getMonth() + months);
  return parsed.toISOString().slice(0, 10);
}

function buildPaymentStatus(receivedAmount: number, totalAmount: number) {
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
}

function normalizeOrderPayment(order: Partial<OrderPayment>): OrderPayment {
  const totalAmount = toMoney(order.totalAmount);
  const advancePaid = toMoney(order.advancePaid);
  const receivedAmount = Math.max(toMoney(order.receivedAmount), advancePaid);
  const remainingAmount = Math.max(totalAmount - receivedAmount, 0);

  return {
    orderId: order.orderId ?? "",
    client: order.client ?? "",
    totalAmount,
    advancePaid,
    receivedAmount,
    remainingAmount,
    paymentStatus: order.paymentStatus?.trim() || buildPaymentStatus(receivedAmount, totalAmount),
  };
}

function normalizeRunningWorkFinancials(work: Partial<RunningWork>) {
  const totalAmount = toMoney(work.totalAmount ?? work.budget);
  const budget = toMoney(work.budget ?? totalAmount);
  const advancePaid = toMoney(work.advancePaid);
  const receivedAmount = Math.max(toMoney(work.receivedAmount), advancePaid);
  const remainingAmount = Math.max(totalAmount - receivedAmount, 0);

  return {
    budget,
    totalAmount,
    advancePaid,
    receivedAmount,
    remainingAmount,
  };
}

function normalizeRunningWork(work: Partial<RunningWork>): RunningWork {
  const financials = normalizeRunningWorkFinancials(work);

  return {
    project: work.project ?? "",
    client: work.client ?? "",
    location: work.location ?? "",
    status: work.status ?? "",
    progress: Number(work.progress ?? 0),
    budget: financials.budget,
    startDate: work.startDate ?? "",
    expectedEndDate: work.expectedEndDate ?? "",
    totalAmount: financials.totalAmount,
    advancePaid: financials.advancePaid,
    receivedAmount: financials.receivedAmount,
    remainingAmount: financials.remainingAmount,
    warrantyMonths: Number(work.warrantyMonths ?? 0),
  };
}

function normalizeCompletedWork(work: Partial<CompletedWork>): CompletedWork {
  const completedOn = toIsoDate(work.completedOn);
  const warrantyMonths = Math.max(Number(work.warrantyMonths ?? 0), 0);
  const warrantyStartOn = completedOn;
  const warrantyValidTill =
    completedOn && warrantyMonths > 0
      ? addMonthsToDate(completedOn, warrantyMonths)
      : completedOn;

  return {
    project: work.project ?? "",
    client: work.client ?? "",
    completedOn,
    value: Number(work.value ?? 0),
    warrantyMonths,
    warrantyStartOn,
    warrantyValidTill,
  };
}

function normalizeStockItem(item: Partial<StockItem>): StockItem {
  const parsedQuantity =
    item.quantity ?? Number(String(item.available ?? "").match(/\d+(\.\d+)?/)?.[0] ?? 0);
  const quantity = toMoney(parsedQuantity);
  const unit =
    item.unit?.trim() ||
    String(item.available ?? "").replace(/^\s*\d+(\.\d+)?\s*/, "").trim() ||
    "units";
  const reorderLevel = toMoney(item.reorderLevel ?? 0);

  return {
    item: item.item ?? "",
    quantity,
    unit,
    reorderLevel,
    available: item.available?.trim() || `${quantity} ${unit}`,
    status: quantity <= reorderLevel ? "Low stock" : "Healthy",
  };
}

function normalizeProduct(product: Partial<Product>): Product {
  const image = String(product.image ?? "").trim();
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];

  return {
    slug: String(product.slug ?? "").trim(),
    name: String(product.name ?? "").trim(),
    category: String(product.category ?? "").trim(),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    shortDescription: String(product.shortDescription ?? "").trim(),
    description: String(product.description ?? "").trim(),
    size: String(product.size ?? "").trim(),
    weight: String(product.weight ?? "").trim(),
    pricing: String(product.pricing ?? "").trim(),
    material: String(product.material ?? "").trim(),
    thickness: String(product.thickness ?? "").trim(),
    visibility: String(product.visibility ?? "").trim(),
    warranty: String(product.warranty ?? "").trim(),
    bestFor: Array.isArray(product.bestFor) ? product.bestFor.map((item) => String(item ?? "").trim()).filter(Boolean) : [],
    features: Array.isArray(product.features) ? product.features.map((item) => String(item ?? "").trim()).filter(Boolean) : [],
    realProjects: Array.isArray(product.realProjects)
      ? product.realProjects.map((item) => ({
        title: String(item?.title ?? "").trim(),
        client: String(item?.client ?? "").trim(),
        location: String(item?.location ?? "").trim(),
        summary: String(item?.summary ?? "").trim(),
      }))
      : [],
  };
}

function normalizeWebsiteWork(work: Partial<WebWork>): WebWork {
  return {
    id: String(work.id ?? "").trim(),
    title: String(work.title ?? "").trim(),
    client: String(work.client ?? "").trim(),
    location: String(work.location ?? "").trim(),
    image: String(work.image ?? "").trim(),
    productSlug: String(work.productSlug ?? "").trim(),
    status: String(work.status ?? "").trim(),
    summary: String(work.summary ?? "").trim(),
  };
}

function dedupeCompletedWorks(works: CompletedWork[]) {
  const seen = new Set<string>();

  return works.filter((work) => {
    const key = `${work.project}::${work.client}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function backfillCompletedWorkWarrantyFields() {
  if (!isMongoConfigured) {
    return;
  }

  await connectToDatabase();

  const records = await CompletedWorkModel.find({
    $or: [
      { warrantyMonths: { $exists: false } },
      { warrantyStartOn: { $exists: false } },
      { warrantyValidTill: { $exists: false } },
    ],
  });

  if (!records.length) {
    return;
  }

  await Promise.all(
    records.map(async (record) => {
      const completedOn = toIsoDate(record.completedOn);
      const warrantyMonths = Math.max(Number(record.warrantyMonths ?? 0), 12);
      const warrantyStartOn = completedOn;
      const warrantyValidTill = addMonthsToDate(completedOn, warrantyMonths);

      record.completedOn = completedOn || record.completedOn;
      record.warrantyMonths = warrantyMonths;
      record.warrantyStartOn = warrantyStartOn || record.completedOn;
      record.warrantyValidTill = warrantyValidTill || record.completedOn;

      await record.save();
    }),
  );
}

function cloneDemoData(): DashboardSnapshot {
  return {
    products: structuredClone(demoProducts),
    websiteWorks: structuredClone(demoWebsiteWorks),
    runningWorks: structuredClone(demoRunningWorks),
    completedWorks: structuredClone(demoCompletedWorks),
    orderPayments: structuredClone(demoOrderPayments),
    stockItems: structuredClone(demoStockItems),
    source: "demo",
  };
}

function ensureMongoEnabled() {
  if (!isMongoConfigured) {
    throw new Error("MongoDB is not configured yet. Add MONGODB_URI in .env.local first.");
  }
}

export function getDashboardDemoData() {
  return cloneDemoData();
}

export async function getDashboardData(): Promise<DashboardSnapshot> {
  if (!isMongoConfigured) {
    return cloneDemoData();
  }

  await connectToDatabase();
  await backfillCompletedWorkWarrantyFields();

  const [products, websiteWorks, runningWorks, completedWorks, orderPayments, stockItems] =
    await Promise.all([
      ProductModel.find().sort({ createdAt: -1, _id: -1 }).lean<Product[]>(),
      WebsiteWorkModel.find().sort({ createdAt: -1, _id: -1 }).lean<WebWork[]>(),
      RunningWorkModel.find().sort({ createdAt: -1, _id: -1 }).lean<RunningWork[]>(),
      CompletedWorkModel.find().sort({ updatedAt: -1, createdAt: -1, _id: -1 }).lean<CompletedWork[]>(),
      OrderPaymentModel.find().sort({ createdAt: -1, _id: -1 }).lean<OrderPayment[]>(),
      StockItemModel.find().sort({ createdAt: -1, _id: -1 }).lean<StockItem[]>(),
    ]);

  const plainProducts = toPlainData(products).map((product) => normalizeProduct(product));
  const plainWebsiteWorks = toPlainData(websiteWorks).map((work) => normalizeWebsiteWork(work));
  const plainRunningWorks = toPlainData(runningWorks).map((work) => normalizeRunningWork(work));
  const plainCompletedWorks = dedupeCompletedWorks(
    toPlainData(completedWorks).map((work) => normalizeCompletedWork(work)),
  );
  const plainOrderPayments = toPlainData(orderPayments).map((order) => normalizeOrderPayment(order));
  const plainStockItems = toPlainData(stockItems).map((item) => normalizeStockItem(item));

  const hasStoredData = [
    plainProducts.length,
    plainWebsiteWorks.length,
    plainRunningWorks.length,
    plainCompletedWorks.length,
    plainOrderPayments.length,
    plainStockItems.length,
  ].some((count) => count > 0);

  if (!hasStoredData) {
    return seedDashboardData();
  }

  return {
    products: plainProducts,
    websiteWorks: plainWebsiteWorks,
    runningWorks: plainRunningWorks,
    completedWorks: plainCompletedWorks,
    orderPayments: plainOrderPayments,
    stockItems: plainStockItems,
    source: "database",
  };
}

export async function getWebsiteCatalogData(): Promise<WebsiteCatalogSnapshot> {
  try {
    const snapshot = await getDashboardData();

    return {
      products: snapshot.products,
      websiteWorks: snapshot.websiteWorks,
      source: snapshot.source,
    };
  } catch {
    const fallback = cloneDemoData();

    return {
      products: fallback.products,
      websiteWorks: fallback.websiteWorks,
      source: fallback.source,
    };
  }
}

export async function seedDashboardData(): Promise<DashboardSnapshot> {
  if (!isMongoConfigured) {
    return cloneDemoData();
  }

  await connectToDatabase();

  await Promise.all([
    ProductModel.deleteMany({}),
    WebsiteWorkModel.deleteMany({}),
    RunningWorkModel.deleteMany({}),
    CompletedWorkModel.deleteMany({}),
    OrderPaymentModel.deleteMany({}),
    StockItemModel.deleteMany({}),
  ]);

  await Promise.all([
    ProductModel.insertMany(demoProducts),
    WebsiteWorkModel.insertMany(demoWebsiteWorks),
    RunningWorkModel.insertMany(demoRunningWorks),
    CompletedWorkModel.insertMany(demoCompletedWorks),
    OrderPaymentModel.insertMany(demoOrderPayments),
    StockItemModel.insertMany(demoStockItems),
  ]);

  return getDashboardData();
}

export async function addProductRecord(product: Product) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedProduct = normalizeProduct(product);

  await ProductModel.findOneAndUpdate(
    { slug: normalizedProduct.slug },
    normalizedProduct,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export async function updateProductRecord(originalSlug: string, product: Product) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedProduct = normalizeProduct(product);

  if (originalSlug === normalizedProduct.slug) {
    await ProductModel.findOneAndUpdate(
      { slug: originalSlug },
      normalizedProduct,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return;
  }

  await Promise.all([
    ProductModel.findOneAndUpdate(
      { slug: originalSlug },
      normalizedProduct,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
    ProductModel.deleteOne({ slug: originalSlug }),
  ]);
}

export async function removeProductRecord(slug: string) {
  ensureMongoEnabled();
  await connectToDatabase();

  await Promise.all([
    ProductModel.deleteOne({ slug }),
    WebsiteWorkModel.deleteMany({ productSlug: slug }),
  ]);
}

export async function addWebsiteWorkRecord(work: WebWork) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedWork = normalizeWebsiteWork(work);

  await WebsiteWorkModel.findOneAndUpdate(
    { id: normalizedWork.id },
    normalizedWork,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export async function removeWebsiteWorkRecord(id: string) {
  ensureMongoEnabled();
  await connectToDatabase();

  await WebsiteWorkModel.deleteOne({ id });
}

export async function addRunningWorkRecord(work: RunningWork) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedWork = normalizeRunningWork(work);

  if (normalizedWork.receivedAmount > normalizedWork.totalAmount) {
    throw new Error("Received payment cannot be greater than total work amount.");
  }

  await RunningWorkModel.create(normalizedWork);
}

export async function addCompletedWorkRecord(work: CompletedWork) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedWork = normalizeCompletedWork(work);

  if (!normalizedWork.completedOn) {
    throw new Error("Completed date is required.");
  }

  if (normalizedWork.warrantyMonths < 1) {
    throw new Error("Warranty period must be at least 1 month.");
  }

  const saved = await CompletedWorkModel.findOneAndUpdate(
    { project: normalizedWork.project, client: normalizedWork.client },
    {
      ...normalizedWork,
      value: toMoney(work.value),
      warrantyMonths: normalizedWork.warrantyMonths,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (saved?._id) {
    await CompletedWorkModel.deleteMany({
      project: normalizedWork.project,
      client: normalizedWork.client,
      _id: { $ne: saved._id },
    });
  }
}

export async function updateCompletedWorkRecord(
  originalProject: string,
  originalClient: string,
  work: CompletedWork,
) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedWork = normalizeCompletedWork(work);

  if (!normalizedWork.completedOn) {
    throw new Error("Completed date is required.");
  }

  if (normalizedWork.warrantyMonths < 1) {
    throw new Error("Warranty period must be at least 1 month.");
  }

  const updated = await CompletedWorkModel.findOneAndUpdate(
    { project: originalProject, client: originalClient },
    {
      ...normalizedWork,
      value: toMoney(work.value),
      warrantyMonths: normalizedWork.warrantyMonths,
    },
    { new: true },
  );

  if (!updated) {
    throw new Error("Completed work record not found.");
  }

  await CompletedWorkModel.deleteMany({
    project: normalizedWork.project,
    client: normalizedWork.client,
    _id: { $ne: updated._id },
  });
}

export async function addRunningWorkPaymentRecord(project: string, client: string, amount: number) {
  ensureMongoEnabled();
  await connectToDatabase();

  const work = await RunningWorkModel.findOne({ project, client });

  if (!work) {
    throw new Error("Running work record not found.");
  }

  const paymentAmount = toMoney(amount);

  if (paymentAmount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (paymentAmount > work.remainingAmount) {
    throw new Error("Payment amount cannot be greater than remaining amount.");
  }

  work.receivedAmount = toMoney(work.receivedAmount + paymentAmount);
  work.remainingAmount = toMoney(Math.max(work.totalAmount - work.receivedAmount, 0));
  await work.save();
}

export async function addOrderReceivedPaymentRecord(orderId: string, amount: number) {
  ensureMongoEnabled();
  await connectToDatabase();

  const order = await OrderPaymentModel.findOne({ orderId });

  if (!order) {
    throw new Error("Order payment record not found.");
  }

  const paymentAmount = toMoney(amount);

  if (paymentAmount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (paymentAmount > order.remainingAmount) {
    throw new Error("Payment amount cannot be greater than remaining amount.");
  }

  order.receivedAmount = toMoney(order.receivedAmount + paymentAmount);
  order.remainingAmount = toMoney(Math.max(order.totalAmount - order.receivedAmount, 0));
  order.paymentStatus = buildPaymentStatus(order.receivedAmount, order.totalAmount);
  await order.save();
}

export async function updateStockItemQuantityRecord(itemName: string, adjustment: number) {
  ensureMongoEnabled();
  await connectToDatabase();

  const stockItem = await StockItemModel.findOne({ item: itemName });

  if (!stockItem) {
    throw new Error("Stock item record not found.");
  }

  const amount = toMoney(adjustment);

  if (amount === 0) {
    throw new Error("Stock adjustment amount must be greater than zero.");
  }

  const nextQuantity = stockItem.quantity + amount;

  if (nextQuantity < 0) {
    throw new Error("Used quantity cannot be greater than available stock.");
  }

  stockItem.quantity = toMoney(nextQuantity);
  stockItem.available = `${stockItem.quantity} ${stockItem.unit}`;
  stockItem.status = stockItem.quantity <= stockItem.reorderLevel ? "Low stock" : "Healthy";
  await stockItem.save();
}

export async function addOrderPaymentRecord(order: OrderPayment) {
  ensureMongoEnabled();
  await connectToDatabase();

  const normalizedOrder = normalizeOrderPayment(order);

  if (normalizedOrder.receivedAmount > normalizedOrder.totalAmount) {
    throw new Error("Received payment cannot be greater than total amount.");
  }

  await OrderPaymentModel.findOneAndUpdate(
    { orderId: normalizedOrder.orderId },
    normalizedOrder,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export async function markPaymentReceivedRecord(orderId: string) {
  ensureMongoEnabled();
  await connectToDatabase();

  const order = await OrderPaymentModel.findOne({ orderId });

  if (!order) {
    throw new Error("Order payment record not found.");
  }

  if (order.remainingAmount <= 0) {
    return order;
  }

  const installment = Math.min(order.remainingAmount, toMoney(order.totalAmount * 0.25));
  const receivedAmount = toMoney(order.receivedAmount + installment);
  const remainingAmount = toMoney(Math.max(order.totalAmount - receivedAmount, 0));

  order.receivedAmount = receivedAmount;
  order.remainingAmount = remainingAmount;
  order.paymentStatus = buildPaymentStatus(receivedAmount, order.totalAmount);

  await order.save();
  return order;
}

export { isMongoConfigured };
