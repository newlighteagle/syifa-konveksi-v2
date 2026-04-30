import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { ArrowLeft, Calendar, CheckCircle2, MessageCircle, PlayCircle, Shirt, Tag } from "lucide-react";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/product-service";
import { products } from "@/lib/products";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container py-8">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/">
            <ArrowLeft />
            Kembali ke katalog
          </Link>
        </Button>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-slate-200 bg-sky-50 shadow-soft lg:aspect-[5/4]">
              <Image
                src={product.mediaUrl}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              {product.mediaType === "video" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-sky-700 shadow-airy">
                    <PlayCircle className="size-8" />
                  </span>
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <Image
                    src={product.mediaUrl}
                    alt={`${product.name} thumbnail ${item + 1}`}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>{product.category}</Badge>
                <Badge variant="success">{product.stockStatus}</Badge>
              </div>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">{product.description}</p>
              <p className="mt-6 text-3xl font-extrabold text-sky-700">
                {formatRupiah(product.harga)}
              </p>
            </div>

            <Card>
              <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
                <InfoItem icon={<Tag />} label="Kode produksi" value={product.kodeProduksi} />
                <InfoItem icon={<Calendar />} label="Periode" value={product.periodeProduksi} />
                <InfoItem icon={<Shirt />} label="Bahan" value={product.material} />
                <InfoItem icon={<CheckCircle2 />} label="Dilihat" value={`${product.views} kali`} />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Ukuran tersedia</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="secondary">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Warna populer</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Badge key={color} variant="outline">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1">
                <MessageCircle />
                Tanya Produk
              </Button>
              <Button variant="outline" className="flex-1">
                Simpan Referensi
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-slate-50 p-4">
      <span className="mt-0.5 text-sky-700 [&_svg]:size-5">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}
