import { AdminProductsWorkspace } from "@/components/admin-products-workspace";
import { AdminShell } from "@/components/admin-shell";
import { listProducts } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <AdminShell title="Kelola Produk">
      <AdminProductsWorkspace products={products} />
    </AdminShell>
  );
}
