import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { AdminProductsList } from "@/components/admin-products-list";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { listProducts } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <AdminShell title="Produk">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700">Produk</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Daftar Produk</h1>
            <p className="mt-2 text-slate-600">
              Kelola katalog produk yang tampil di halaman publik.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle />
              Tambah Produk
            </Link>
          </Button>
        </div>

        <AdminProductsList products={products} />
      </div>
    </AdminShell>
  );
}
