import { Suspense } from "react";

import { BusinessContactSection } from "@/components/business-contact-section";
import { CatalogPage } from "@/components/catalog-page";
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button";
import { SiteVisitTracker } from "@/components/site-visit-tracker";
import { SiteHeader } from "@/components/site-header";
import { listCategories, listProducts } from "@/lib/product-service";
import { buildOrganizationJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function Home() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_42%,#f7f9fb_100%)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
      />
      <SiteHeader />
      <SiteVisitTracker />
      <Suspense>
        <CatalogPage initialProducts={products} categories={categories} />
      </Suspense>
      <BusinessContactSection />
      <FloatingWhatsAppButton />
    </main>
  );
}
