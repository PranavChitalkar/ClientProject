import { ProductDetailPage } from "@/components/site/product-detail-page";
import { getWebsiteCatalogData } from "@/lib/dashboard-data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await getWebsiteCatalogData();

  return <ProductDetailPage slug={slug} initialCatalog={catalog} />;
}
