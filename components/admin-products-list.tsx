"use client";

import Link from "next/link";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductCardMedia } from "@/components/product-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/products";
import { formatRupiah } from "@/lib/utils";

type AdminProductsListProps = {
  products: Product[];
};

export function AdminProductsList({ products }: AdminProductsListProps) {
  const router = useRouter();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Hapus produk "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingProductId(product.id);
    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    setDeletingProductId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      window.alert(body?.message ?? "Produk belum bisa dihapus.");
      return;
    }

    router.refresh();
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Belum ada produk</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Tambahkan produk pertama agar katalog publik mulai terisi.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle />
              Tambah Produk
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
            <Link
              href={`/products/${product.id}`}
              className="relative aspect-square overflow-hidden rounded-lg bg-sky-50"
            >
              <ProductCardMedia
                name={product.name}
                mediaType={product.mediaType}
                mediaUrl={product.mediaUrl}
              />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{product.category}</Badge>
                <Badge variant="secondary">{product.stockStatus}</Badge>
              </div>
              <h2 className="mt-3 truncate text-lg font-bold text-slate-950">{product.name}</h2>
              <p className="mt-1 text-sm font-semibold text-sky-700">{product.kodeProduksi}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {product.description}
              </p>
              <p className="mt-3 font-bold text-slate-950">{formatRupiah(product.harga)}</p>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit3 />
                  Edit
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deletingProductId === product.id}
                onClick={() => handleDelete(product)}
              >
                <Trash2 />
                Hapus
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
