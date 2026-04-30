import Image from "next/image";
import Link from "next/link";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listProducts } from "@/lib/product-service";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <AdminShell title="Kelola Produk">
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[1fr_0.85fr]">
        <section>
          <Badge className="mb-3">CRUD Produk</Badge>
          <h1 className="text-3xl font-extrabold text-slate-950">Kelola Produk</h1>
          <p className="mt-2 text-slate-600">
            Form frontend untuk menambah link media, kode produksi, periode, dan harga.
          </p>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="size-5 text-sky-700" />
                Tambah Produk Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-5">
          <div className="hidden xl:block">
            <h2 className="text-xl font-bold text-slate-950">Produk tersedia</h2>
            <p className="mt-1 text-sm text-slate-600">Data mock untuk visualisasi tabel admin.</p>
          </div>
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="grid gap-4 p-4 sm:grid-cols-[6rem_1fr]">
                <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-lg bg-sky-50">
                  <Image src={product.mediaUrl} alt={product.name} fill sizes="96px" className="object-cover" />
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
                      <Button size="icon" variant="outline" aria-label="Edit produk">
                        <Edit3 />
                      </Button>
                      <Button size="icon" variant="outline" aria-label="Hapus produk">
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
    </AdminShell>
  );
}
