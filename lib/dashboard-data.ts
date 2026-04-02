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

  const [products, websiteWorks, runningWorks, completedWorks, orderPayments, stockItems] =
    await Promise.all([
      ProductModel.find().sort({ createdAt: -1, _id: -1 }).lean<Product[]>(),
      WebsiteWorkModel.find().sort({ createdAt: -1, _id: -1 }).lean<WebWork[]>(),
      RunningWorkModel.find().sort({ createdAt: -1, _id: -1 }).lean<RunningWork[]>(),
      CompletedWorkModel.find().sort({ createdAt: -1, _id: -1 }).lean<CompletedWork[]>(),
      OrderPaymentModel.find().sort({ createdAt: -1, _id: -1 }).lean<OrderPayment[]>(),
      StockItemModel.find().sort({ createdAt: -1, _id: -1 }).lean<StockItem[]>(),
    ]);

  const plainProducts = toPlainData(products);
  const plainWebsiteWorks = toPlainData(websiteWorks);
  const plainRunningWorks = toPlainData(runningWorks);
  const plainCompletedWorks = toPlainData(completedWorks);
  const plainOrderPayments = toPlainData(orderPayments);
  const plainStockItems = toPlainData(stockItems);

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

  await ProductModel.findOneAndUpdate(
    { slug: product.slug },
    product,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
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

  await WebsiteWorkModel.findOneAndUpdate(
    { id: work.id },
    work,
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

  await RunningWorkModel.create(work);
}

export async function addOrderPaymentRecord(order: OrderPayment) {
  ensureMongoEnabled();
  await connectToDatabase();

  const totalAmount = Number(order.totalAmount || 0);
  const receivedAmount = Number(order.receivedAmount || 0);
  const normalizedOrder = {
    ...order,
    totalAmount,
    advancePaid: Number(order.advancePaid || 0),
    receivedAmount,
    remainingAmount: Math.max(totalAmount - receivedAmount, 0),
  };

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

  const installment = Math.min(order.remainingAmount, Math.round(order.totalAmount * 0.25));
  const receivedAmount = order.receivedAmount + installment;
  const remainingAmount = Math.max(order.totalAmount - receivedAmount, 0);

  order.receivedAmount = receivedAmount;
  order.remainingAmount = remainingAmount;
  order.paymentStatus =
    remainingAmount === 0
      ? "Payment completed"
      : `Part payment received - ${Math.round((receivedAmount / order.totalAmount) * 100)}%`;

  await order.save();
  return order;
}

export { isMongoConfigured };
