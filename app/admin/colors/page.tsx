import { AdminOptionManager } from "@/components/admin-option-manager";
import { AdminShell } from "@/components/admin-shell";
import { Badge } from "@/components/ui/badge";
import { listManagedColors } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function AdminColorsPage() {
  const colors = await listManagedColors();

  return (
    <AdminShell title="Warna">
      <div className="mb-8 max-w-3xl">
        <Badge className="mb-3">Admin Operations</Badge>
        <h1 className="text-3xl font-extrabold text-slate-950">Kelola warna</h1>
        <p className="mt-2 text-slate-600">
          Tambahkan opsi warna untuk form produk, dan hapus hanya opsi yang belum dipakai.
        </p>
      </div>

      <AdminOptionManager
        title="Daftar warna"
        label="Warna"
        endpoint="/api/colors"
        options={colors}
        emptyMessage="Belum ada warna."
        placeholder="Navy, Putih, Sage"
      />
    </AdminShell>
  );
}
