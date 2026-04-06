export type RunningWork = {
  project: string;
  client: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  expectedEndDate: string;
  totalAmount: number;
  advancePaid: number;
  receivedAmount: number;
  remainingAmount: number;
  warrantyMonths: number;
};

export type CompletedWork = {
  project: string;
  client: string;
  completedOn: string;
  value: number;
  warrantyMonths: number;
  warrantyStartOn: string;
  warrantyValidTill: string;
};

export type StockItem = {
  item: string;
  available: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
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
    startDate: "2026-01-12",
    expectedEndDate: "2026-05-10",
    totalAmount: 620000,
    advancePaid: 248000,
    receivedAmount: 248000,
    remainingAmount: 372000,
    warrantyMonths: 12,
  },
  {
    project: "Plant Safety Upgrade",
    client: "PrimeForge Industries",
    location: "Chakan MIDC",
    status: "Installation scheduled",
    progress: 82,
    budget: 390000,
    startDate: "2026-02-04",
    expectedEndDate: "2026-04-22",
    totalAmount: 390000,
    advancePaid: 0,
    receivedAmount: 0,
    remainingAmount: 390000,
    warrantyMonths: 6,
  },
  {
    project: "Metro Diversion Signage",
    client: "Urban Rail Contractors",
    location: "Nagpur",
    status: "Material dispatch underway",
    progress: 54,
    budget: 850000,
    startDate: "2026-02-18",
    expectedEndDate: "2026-06-02",
    totalAmount: 850000,
    advancePaid: 250000,
    receivedAmount: 467500,
    remainingAmount: 382500,
    warrantyMonths: 9,
  },
];

export const completedWorks: CompletedWork[] = [
  {
    project: "Warehouse Navigation System",
    client: "SwiftLog Warehousing",
    completedOn: "12 Mar 2026",
    value: 480000,
    warrantyMonths: 12,
    warrantyStartOn: "12 Mar 2026",
    warrantyValidTill: "12 Mar 2027",
  },
  {
    project: "Expressway Caution Sign Package",
    client: "HighRoute Projects",
    completedOn: "03 Mar 2026",
    value: 1120000,
    warrantyMonths: 12,
    warrantyStartOn: "03 Mar 2026",
    warrantyValidTill: "03 Mar 2027",
  },
  {
    project: "Industrial Hazard Sign Set",
    client: "Mitra Process Plant",
    completedOn: "24 Feb 2026",
    value: 260000,
    warrantyMonths: 6,
    warrantyStartOn: "24 Feb 2026",
    warrantyValidTill: "24 Aug 2026",
  },
];

export const stockItems: StockItem[] = [
  { item: "Reflective sheeting rolls", available: "92 rolls", quantity: 92, unit: "rolls", reorderLevel: 25, status: "Healthy" },
  { item: "ACP boards", available: "186 sheets", quantity: 186, unit: "sheets", reorderLevel: 60, status: "Healthy" },
  { item: "GI poles", available: "34 units", quantity: 34, unit: "units", reorderLevel: 40, status: "Low stock" },
  { item: "MS frames", available: "49 units", quantity: 49, unit: "units", reorderLevel: 20, status: "Healthy" },
  { item: "Fasteners and clamps", available: "500 pieces", quantity: 500, unit: "pieces", reorderLevel: 150, status: "Healthy" },
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
