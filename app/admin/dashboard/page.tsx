import Link from "next/link";
import type React from "react";
import {
  Boxes,
  Eye,
  MessageCircle,
  PackageCheck,
  PlusCircle,
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
  const [products, visitorStats] = await Promise.all([listProducts(), getSiteVisitorStats()]);
  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalInquiries = products.reduce((sum, product) => sum + product.inquiries, 0);
  const totalValue = products.reduce((sum, product) => sum + product.harga, 0);
  const readyStock = products.filter((product) => product.stockStatus === "Ready").length;

  return (
    <AdminShell title="Dashboard">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-3">Admin Dashboard</Badge>
          <h1 className="text-3xl font-extrabold text-slate-950">Ringkasan katalog</h1>
          <p className="mt-2 text-slate-600">
            Pantau performa katalog dan lanjutkan ke pengelolaan produk.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products">
            <PlusCircle />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        <Metric icon={<Eye />} label="Total dilihat" value={totalViews.toLocaleString("id-ID")} />
        <Metric icon={<MessageCircle />} label="Total inquiry" value={totalInquiries.toLocaleString("id-ID")} />
        <Metric icon={<PackageCheck />} label="Ready stock" value={`${readyStock} produk`} />
        <Metric icon={<TrendingUp />} label="Nilai katalog" value={formatRupiah(totalValue)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Produk paling sering dilihat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {products
              .slice()
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.kodeProduksi}</p>
                  </div>
                  <Badge variant="secondary">{product.views.toLocaleString("id-ID")} views</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produk paling sering ditanyakan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {products
              .slice()
              .sort((a, b) => b.inquiries - a.inquiries)
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.kodeProduksi}</p>
                  </div>
                  <Badge variant="secondary">{product.inquiries.toLocaleString("id-ID")} inquiry</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status produksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {["Ready", "Preorder", "Terbatas"].map((status) => {
              const count = products.filter((product) => product.stockStatus === status).length;
              const width = `${Math.max(16, (count / products.length) * 100)}%`;
              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span>{status}</span>
                    <span className="text-slate-500">{count} produk</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
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
      <CardContent className="p-5">
        <span className="flex size-11 items-center justify-center rounded-lg bg-sky-50 text-sky-700 [&_svg]:size-5">
          {icon}
        </span>
        <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}
