"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={collapsed ? "icon" : "default"}
      disabled={isLoading}
      title="Keluar"
      onClick={handleLogout}
    >
      <LogOut />
      {collapsed ? null : isLoading ? "Keluar..." : "Keluar"}
    </Button>
  );
}
