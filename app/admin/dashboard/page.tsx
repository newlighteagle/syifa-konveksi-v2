import Link from "next/link";
import type React from "react";
import {
  Boxes,
  Eye,
  FilePenLine,
  MessageCircle,
  PackageCheck,
  PlusCircle,
  Send,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listProducts } from "@/lib/product-service";
import { formatRupiah } from "@/lib/utils";
import { getSiteVisitorStats } from "@/lib/visitor-service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, visitorStats] = await Promise.all([
    listProducts({ includeDrafts: true }),
    getSiteVisitorStats(),
  ]);
  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalInquiries = products.reduce((sum, product) => sum + product.inquiries, 0);
  const totalValue = products.reduce((sum, product) => sum + product.harga, 0);
  const readyStock = products.filter((product) => product.stockStatus === "Ready").length;
  const publishedProducts = products.filter((product) => product.publicationStatus === "published").length;
  const draftProducts = products.filter((product) => product.publicationStatus === "draft").length;
  const topViewedProducts = products.slice().sort((a, b) => b.views - a.views).slice(0, 5);
  const topInquiryProducts = products.slice().sort((a, b) => b.inquiries - a.inquiries).slice(0, 5);

  return (
    <AdminShell title="Dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge className="mb-2">Admin Dashboard</Badge>
          <h1 className="text-2xl font-extrabold text-slate-950">Ringkasan katalog</h1>
          <p className="mt-1 text-sm text-slate-600">Metrik katalog, publikasi, dan minat produk.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products">
            <PlusCircle />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<UsersRound />}
          label="Total pengunjung"
          value={visitorStats.totalVisitors.toLocaleString("id-ID")}
        />
        <Metric
          icon={<UserRoundCheck />}
          label="Unique pengunjung"
          value={visitorStats.uniqueVisitors.toLocaleString("id-ID")}
        />
        <Metric icon={<Boxes />} label="Total produk" value={`${products.length}`} />
        <Metric icon={<Send />} label="Published" value={`${publishedProducts} produk`} />
        <Metric icon={<FilePenLine />} label="Draft" value={`${draftProducts} produk`} />
        <Metric icon={<Eye />} label="Total dilihat" value={totalViews.toLocaleString("id-ID")} />
        <Metric icon={<MessageCircle />} label="Total inquiry" value={totalInquiries.toLocaleString("id-ID")} />
        <Metric icon={<PackageCheck />} label="Ready stock" value={`${readyStock} produk`} />
        <Metric icon={<TrendingUp />} label="Nilai katalog" value={formatRupiah(totalValue)} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Produk paling sering dilihat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <ProductRankList products={topViewedProducts} valueKey="views" suffix="views" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Produk paling sering ditanyakan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <ProductRankList products={topInquiryProducts} valueKey="inquiries" suffix="inquiry" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Status produksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {["Ready", "Preorder", "Terbatas"].map((status) => {
              const count = products.filter((product) => product.stockStatus === status).length;
              const width = getStatusWidth(count, products.length);
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm font-semibold">
                    <span>{status}</span>
                    <span className="text-slate-500">{count} produk</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full sky-gradient" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

type RankedProduct = {
  id: string;
  name: string;
  kodeProduksi: string;
  inquiries: number;
  views: number;
};

function ProductRankList({
  products,
  suffix,
  valueKey,
}: {
  products: RankedProduct[];
  suffix: string;
  valueKey: "inquiries" | "views";
}) {
  if (products.length === 0) {
    return <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Belum ada produk.</p>;
  }

  return (
    <>
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{product.name}</p>
            <p className="text-xs text-slate-500">{product.kodeProduksi}</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {product[valueKey].toLocaleString("id-ID")} {suffix}
          </Badge>
        </div>
      ))}
    </>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 [&_svg]:size-5">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-0.5 truncate text-xl font-extrabold text-slate-950">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusWidth(count: number, total: number) {
  if (total <= 0 || count <= 0) {
    return "0%";
  }

  return `${Math.max(12, (count / total) * 100)}%`;
}
