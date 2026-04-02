import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getDashboardData, getDashboardDemoData, isMongoConfigured } from "@/lib/dashboard-data";

export default async function AdminDashboardPage() {
  const snapshot = await getDashboardData().catch(() => getDashboardDemoData());

  return (
    <AdminDashboard
      initialSnapshot={{
        ...snapshot,
        mongoConfigured: isMongoConfigured,
      }}
    />
  );
}
