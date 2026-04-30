import { CatalogPage } from "@/components/catalog-page";
import { SiteHeader } from "@/components/site-header";
import { listCategories, listProducts } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_42%,#f7f9fb_100%)]">
      <SiteHeader />
      <CatalogPage initialProducts={products} categories={categories} />
    </main>
  );
}
