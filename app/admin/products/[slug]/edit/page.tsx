import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductBySlug, listCategoryOptions, listColorOptions } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, categories, colors] = await Promise.all([
    getProductBySlug(slug),
    listCategoryOptions(),
    listColorOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell title="Edit Produk">
      <div className="max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/admin/products">
            <ArrowLeft />
            Kembali ke daftar produk
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Edit Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={product}
              categories={categories}
              colors={colors}
              submitLabel="Update Produk"
            />
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
