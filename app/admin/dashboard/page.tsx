import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminUserFromCookies } from "@/lib/admin-auth";
import { getDashboardData, getDashboardDemoData, isMongoConfigured } from "@/lib/dashboard-data";
import { notFound } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await getAdminUserFromCookies();
  if (!user) {
    notFound();
  }

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
