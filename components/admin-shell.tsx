"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { BarChart3, Boxes, Palette, PanelLeftClose, PanelLeftOpen, Tags } from "lucide-react";

import { AdminLogoutButton } from "@/components/admin-logout-button";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Produk", href: "/admin/products", icon: Boxes },
  { label: "Kategori", href: "/admin/categories", icon: Tags },
  { label: "Warna", href: "/admin/colors", icon: Palette },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(localStorage.getItem("syifa-admin-sidebar") === "collapsed");
  }, []);

  function toggleSidebar() {
    setIsCollapsed((current) => {
      const next = !current;
      localStorage.setItem("syifa-admin-sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  }

  return (
    <main
      className={cn(
        "min-h-screen bg-background lg:grid",
        isCollapsed ? "lg:grid-cols-[5rem_1fr]" : "lg:grid-cols-[16rem_1fr]",
      )}
    >
      <aside className="hidden border-r border-slate-100 bg-white lg:block">
        <div className={cn("sticky top-0 flex h-screen flex-col p-4", isCollapsed && "items-center px-3")}>
          <div className={cn("flex w-full items-center gap-2", isCollapsed ? "justify-center" : "justify-between")}>
            <Link
              href="/"
              className={cn(
                "flex min-w-0 items-center gap-3 py-2",
                isCollapsed ? "justify-center" : "px-1",
              )}
              title="Syifa Admin"
            >
              <BrandLogo className="size-10" />
              <div className={cn("min-w-0", isCollapsed && "hidden")}>
                <p className="truncate font-extrabold text-slate-950">Syifa Admin</p>
                <p className="truncate text-xs font-medium text-slate-500">Production Portal</p>
              </div>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(isCollapsed && "hidden")}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              onClick={toggleSidebar}
            >
              <PanelLeftClose />
            </Button>
          </div>
          {isCollapsed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-4"
              title="Expand sidebar"
              aria-label="Expand sidebar"
              onClick={toggleSidebar}
            >
              <PanelLeftOpen />
            </Button>
          ) : null}
          <nav className={cn("mt-6 flex flex-1 flex-col gap-2", isCollapsed && "items-center")}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700",
                  isCollapsed ? "size-11 justify-center" : "w-full px-4 py-3",
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span className={cn(isCollapsed && "sr-only")}>{item.label}</span>
              </Link>
            ))}
          </nav>
          <AdminLogoutButton collapsed={isCollapsed} />
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
