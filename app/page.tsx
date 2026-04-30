import { CatalogPage } from "@/components/catalog-page";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_42%,#f7f9fb_100%)]">
      <SiteHeader />
      <CatalogPage />
    </main>
  );
}
