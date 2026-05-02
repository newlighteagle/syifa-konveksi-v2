import Link from "next/link";
import type React from "react";
import { ArrowLeft, Calendar, CheckCircle2, MessageCircle, Shirt, Tag } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { ProductDetailMedia, ProductCardMedia } from "@/components/product-media";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug, incrementProductViews } from "@/lib/product-service";
import { products } from "@/lib/products";
import { formatRupiah } from "@/lib/utils";
import { buildProductInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

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
  await incrementProductViews(id);
  const [product, requestHeaders] = await Promise.all([getProductBySlug(id), headers()]);

  if (!product) {
    notFound();
  }

  const galleryMedia = product.galleryUrls.filter(Boolean);
  const productUrl = getProductUrl(requestHeaders, product.id);
  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    message: buildProductInquiryMessage({
      name: product.name,
      kodeProduksi: product.kodeProduksi,
      harga: formatRupiah(product.harga),
      url: productUrl,
    }),
  });

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
              <ProductDetailMedia
                name={product.name}
                mediaType={product.mediaType}
                mediaUrl={product.mediaUrl}
                priority
              />
            </div>
            {galleryMedia.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {galleryMedia.slice(0, 6).map((mediaUrl, item) => (
                  <div
                    key={`${mediaUrl}-${item}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <ProductCardMedia
                      name={`${product.name} thumbnail ${item + 1}`}
                      mediaType="image"
                      mediaUrl={mediaUrl}
                    />
                  </div>
                ))}
              </div>
            ) : null}
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
              {product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="secondary">
                      {size}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyAttribute message="Ukuran belum tersedia. Hubungi admin untuk pilihan ukuran." />
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Warna populer</p>
              {product.colors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="outline">
                      {color}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyAttribute message="Warna belum tersedia. Tim kami bisa bantu cek opsi warna." />
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {whatsappUrl ? (
                <Button asChild className="flex-1">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle />
                    Tanya Produk
                  </a>
                </Button>
              ) : (
                <Button className="flex-1" disabled title="Nomor WhatsApp belum diset">
                  <MessageCircle />
                  WhatsApp belum diset
                </Button>
              )}
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

function EmptyAttribute({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
      {message}
    </p>
  );
}

function getProductUrl(requestHeaders: Headers, productId: string) {
  const host = requestHeaders.get("host");

  if (!host) {
    return `https://www.syifakonveksi.my.id/products/${productId}`;
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}/products/${productId}`;
}
