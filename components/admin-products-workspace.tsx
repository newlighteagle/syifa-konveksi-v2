"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductForm } from "@/components/product-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/products";
import { formatRupiah } from "@/lib/utils";

export function AdminProductsWorkspace({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(`Hapus produk "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });

    setDeletingId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      window.alert(body?.message ?? "Produk belum bisa dihapus.");
      return;
    }

    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    }

    router.refresh();
  }

  function handleSaved() {
    setSelectedProduct(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[1fr_0.85fr]">
      <section>
        <Badge className="mb-3">CRUD Produk</Badge>
        <h1 className="text-3xl font-extrabold text-slate-950">Kelola Produk</h1>
        <p className="mt-2 text-slate-600">
          Tambahkan produk baru atau pilih produk di daftar untuk mengubah data.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="size-5 text-sky-700" />
              {selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={selectedProduct}
              onSaved={handleSaved}
              onCancelEdit={() => setSelectedProduct(null)}
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="hidden xl:block">
          <h2 className="text-xl font-bold text-slate-950">Produk tersedia</h2>
          <p className="mt-1 text-sm text-slate-600">
            Pilih edit untuk memuat data produk ke form.
          </p>
        </div>
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-slate-600">
              Belum ada produk. Tambahkan produk pertama dari form di samping.
            </CardContent>
          </Card>
        ) : null}
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[6rem_1fr]">
              <Link
                href={`/products/${product.id}`}
                className="relative aspect-square overflow-hidden rounded-lg bg-sky-50"
              >
                {product.mediaType === "image" ? (
                  <Image
                    src={product.mediaUrl}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sky-50 text-xs font-bold text-sky-700">
                    Video
                  </div>
                )}
              </Link>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="truncate font-bold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.kodeProduksi}</p>
                  </div>
                  <Badge variant="secondary">{product.stockStatus}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-bold text-sky-700">{formatRupiah(product.harga)}</p>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant={selectedProduct?.id === product.id ? "secondary" : "outline"}
                      aria-label="Edit produk"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Edit3 />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Hapus produk"
                      disabled={deletingId === product.id}
                      onClick={() => deleteProduct(product)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
