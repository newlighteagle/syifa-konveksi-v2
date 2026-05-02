import Link from "next/link";
import { LayoutDashboard, Search, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo className="size-10" />
          <span className="text-lg font-extrabold text-sky-700">Syifa Konveksi</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link className="text-sky-700" href="/">
            Katalog
          </Link>
          <a className="transition hover:text-sky-700" href="#koleksi">
            Koleksi
          </a>
          <a className="transition hover:text-sky-700" href="#kontak">
            Kontak
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Cari">
            <Search />
          </Button>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/admin">
              <ShieldCheck />
              Admin
            </Link>
          </Button>
          <Button asChild size="icon" variant="secondary" className="lg:hidden">
            <Link href="/admin/dashboard" aria-label="Dashboard admin">
              <LayoutDashboard />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
