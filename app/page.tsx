import { BusinessHomepage } from "@/components/site/business-homepage";
import { getWebsiteCatalogData } from "@/lib/dashboard-data";

export default async function Home() {
  const catalog = await getWebsiteCatalogData();

  return <BusinessHomepage initialCatalog={catalog} />;
}
