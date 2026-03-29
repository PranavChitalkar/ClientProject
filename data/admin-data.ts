export type RunningWork = {
  project: string;
  client: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
};

export type CompletedWork = {
  project: string;
  client: string;
  completedOn: string;
  value: number;
};

export type StockItem = {
  item: string;
  available: string;
  status: "Healthy" | "Low stock";
};

export type OrderPayment = {
  orderId: string;
  client: string;
  totalAmount: number;
  advancePaid: number;
  receivedAmount: number;
  remainingAmount: number;
  paymentStatus: string;
};

export const adminCredentials = {
  email: "admin@safepathsigns.com",
  password: "Admin@123",
};

export const runningWorks: RunningWork[] = [
  {
    project: "NH-48 Overhead Direction Boards",
    client: "Western Corridor Infra",
    location: "Pune - Satara",
    status: "Fabrication in progress",
    progress: 68,
    budget: 620000,
  },
  {
    project: "Plant Safety Upgrade",
    client: "PrimeForge Industries",
    location: "Chakan MIDC",
    status: "Installation scheduled",
    progress: 82,
    budget: 390000,
  },
  {
    project: "Metro Diversion Signage",
    client: "Urban Rail Contractors",
    location: "Nagpur",
    status: "Material dispatch underway",
    progress: 54,
    budget: 850000,
  },
];

export const completedWorks: CompletedWork[] = [
  {
    project: "Warehouse Navigation System",
    client: "SwiftLog Warehousing",
    completedOn: "12 Mar 2026",
    value: 480000,
  },
  {
    project: "Expressway Caution Sign Package",
    client: "HighRoute Projects",
    completedOn: "03 Mar 2026",
    value: 1120000,
  },
  {
    project: "Industrial Hazard Sign Set",
    client: "Mitra Process Plant",
    completedOn: "24 Feb 2026",
    value: 260000,
  },
];

export const stockItems: StockItem[] = [
  { item: "Reflective sheeting rolls", available: "92 rolls", status: "Healthy" },
  { item: "ACP boards", available: "186 sheets", status: "Healthy" },
  { item: "GI poles", available: "34 units", status: "Low stock" },
  { item: "MS frames", available: "49 units", status: "Healthy" },
  { item: "Fasteners and clamps", available: "Bulk available", status: "Healthy" },
];

export const orderPayments: OrderPayment[] = [
  {
    orderId: "ORD-2418",
    client: "Western Corridor Infra",
    totalAmount: 620000,
    advancePaid: 248000,
    receivedAmount: 248000,
    remainingAmount: 372000,
    paymentStatus: "40% advance received",
  },
  {
    orderId: "ORD-2423",
    client: "PrimeForge Industries",
    totalAmount: 390000,
    advancePaid: 0,
    receivedAmount: 0,
    remainingAmount: 390000,
    paymentStatus: "Advance pending",
  },
  {
    orderId: "ORD-2431",
    client: "Urban Rail Contractors",
    totalAmount: 850000,
    advancePaid: 250000,
    receivedAmount: 467500,
    remainingAmount: 382500,
    paymentStatus: "55% amount received",
  },
];
