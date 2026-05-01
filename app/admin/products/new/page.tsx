import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProductPage() {
  return (
    <AdminShell title="Tambah Produk">
      <div className="max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/admin/products">
            <ArrowLeft />
            Kembali ke daftar produk
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm submitLabel="Simpan Produk" />
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
