import Image from "next/image";
import Link from "next/link";
import { Edit3, ImagePlus, PlusCircle, Save, Trash2 } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { products } from "@/lib/products";
import { formatRupiah } from "@/lib/utils";

export default function AdminProductsPage() {
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
              <form className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Nama Produk" id="name" placeholder="Gamis Seragam Biru" />
                  <Field label="Kode Produksi" id="code" placeholder="GMS-1024-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" placeholder="Detail bahan, ukuran, model, dan catatan produksi..." />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <Field label="Periode" id="period" type="month" />
                  <Field label="Harga" id="price" type="number" placeholder="150000" />
                  <div className="space-y-2">
                    <Label htmlFor="mediaType">Media Type</Label>
                    <select
                      id="mediaType"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                    >
                      <option>image</option>
                      <option>video</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mediaUrl">Link Gambar / Video Instagram</Label>
                  <div className="relative">
                    <ImagePlus className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input id="mediaUrl" placeholder="https://instagram.com/..." className="pl-10" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button>
                    <Save />
                    Simpan Produk
                  </Button>
                  <Button type="button" variant="outline">
                    Preview
                  </Button>
                </div>
              </form>
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

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} />
    </div>
  );
}
