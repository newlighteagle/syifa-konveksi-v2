import { headers } from "next/headers";

import { BusinessContactSection } from "@/components/business-contact-section";
import { CatalogPage } from "@/components/catalog-page";
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button";
import { SiteHeader } from "@/components/site-header";
import { listCategories, listProducts } from "@/lib/product-service";
import { getPublicIpFromHeaders, recordSiteVisit } from "@/lib/visitor-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const requestHeaders = await headers();
  await recordSiteVisit(getPublicIpFromHeaders(requestHeaders));

  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_42%,#f7f9fb_100%)]">
      <SiteHeader />
      <CatalogPage initialProducts={products} categories={categories} />
      <BusinessContactSection />
      <FloatingWhatsAppButton />
    </main>
  );
}
