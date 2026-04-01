import { seedDashboardData } from "../lib/dashboard-data";

async function run() {
  const snapshot = await seedDashboardData();

  console.log("MongoDB dashboard seed completed.");
  console.table({
    products: snapshot.products.length,
    websiteWorks: snapshot.websiteWorks.length,
    runningWorks: snapshot.runningWorks.length,
    completedWorks: snapshot.completedWorks.length,
    orderPayments: snapshot.orderPayments.length,
    stockItems: snapshot.stockItems.length,
    source: snapshot.source,
  });
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("MongoDB seed failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
