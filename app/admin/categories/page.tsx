import { AdminOptionManager } from "@/components/admin-option-manager";
import { AdminShell } from "@/components/admin-shell";
import { Badge } from "@/components/ui/badge";
import { listManagedCategories } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listManagedCategories();

  return (
    <AdminShell title="Kategori">
      <div className="mb-8 max-w-3xl">
        <Badge className="mb-3">Admin Operations</Badge>
        <h1 className="text-3xl font-extrabold text-slate-950">Kelola kategori</h1>
        <p className="mt-2 text-slate-600">
          Tambahkan kategori sebelum membuat produk, dan hapus hanya opsi yang belum dipakai.
        </p>
      </div>

      <AdminOptionManager
        title="Daftar kategori"
        label="Kategori"
        endpoint="/api/categories"
        options={categories}
        emptyMessage="Belum ada kategori."
        placeholder="Gamis, Seragam, Kemeja"
      />
    </AdminShell>
  );
}
