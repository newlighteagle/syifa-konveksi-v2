import Link from "next/link";
import type React from "react";
import { BarChart3, Boxes } from "lucide-react";

import { AdminLogoutButton } from "@/components/admin-logout-button";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Produk", href: "/admin/products", icon: Boxes },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-slate-100 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-4">
            <span className="flex size-10 items-center justify-center rounded-lg sky-gradient text-sm font-black text-white">
              SK
            </span>
            <div>
              <p className="font-extrabold text-slate-950">Syifa Admin</p>
              <p className="text-xs font-medium text-slate-500">Production Portal</p>
            </div>
          </Link>
          <nav className="mt-6 flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <AdminLogoutButton />
        </div>
      </aside>
      <section>
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <p className="font-bold text-slate-950">{title}</p>
          </div>
        </header>
        <div className="px-5 py-8 sm:px-8 lg:px-12">{children}</div>
      </section>
    </main>
  );
}
