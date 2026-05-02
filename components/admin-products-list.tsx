"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  LayoutGrid,
  List,
  PlusCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ProductCardMedia, ProductDetailMedia } from "@/components/product-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/products";
import { cn, formatRupiah } from "@/lib/utils";

type ViewMode = "list" | "card";
type SortKey =
  | "updated-desc"
  | "name-asc"
  | "name-desc"
  | "code-asc"
  | "code-desc"
  | "period-desc"
  | "period-asc"
  | "category-asc"
  | "color-asc"
  | "price-desc"
  | "price-asc";

type AdminProductsListProps = {
  products: Product[];
  categories: Array<{ id: string; name: string }>;
};

export function AdminProductsList({ products, categories }: AdminProductsListProps) {
  const router = useRouter();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = categoryFilter === "Semua" || product.category === categoryFilter;
      const matchesSearch =
        !query ||
        [
          product.name,
          product.category,
          product.description,
          product.kodeProduksi,
          product.stockStatus,
          product.material,
          product.sizes.join(" "),
          product.colors.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });

    return filtered.sort((left, right) => compareProducts(left, right, sortKey));
  }, [categoryFilter, products, searchQuery, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectedProduct =
    paginatedProducts.find((product) => product.id === selectedProductId) ??
    paginatedProducts[0] ??
    null;
  const pageStart = filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, filteredProducts.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery, sortKey, viewMode]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  function requestDelete(product: Product) {
    setDeleteError("");
    setPendingDeleteProduct(product);
  }

  async function confirmDelete() {
    if (!pendingDeleteProduct || deletingProductId) {
      return;
    }

    const product = pendingDeleteProduct;
    setDeletingProductId(product.id);
    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    setDeletingProductId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setDeleteError(body?.message ?? "Produk belum bisa dihapus.");
      return;
    }

    if (selectedProductId === product.id) {
      setSelectedProductId("");
    }
    setPendingDeleteProduct(null);
    setDeleteError("");
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Belum ada produk</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Tambahkan produk pertama agar katalog publik mulai terisi.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle />
              Tambah Produk
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-5">
      <Card>
        <CardContent className="grid gap-2 p-3">
          <div className="grid gap-2 lg:grid-cols-[1fr_13rem_14rem_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
                placeholder="Cari produk, kode, bahan, ukuran, warna"
              />
            </label>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              <option value="Semua">Semua kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              <option value="updated-desc">Terbaru diupdate</option>
              <option value="name-asc">Nama A-Z</option>
              <option value="name-desc">Nama Z-A</option>
              <option value="code-asc">Kode A-Z</option>
              <option value="code-desc">Kode Z-A</option>
              <option value="period-desc">Periode terbaru</option>
              <option value="period-asc">Periode terlama</option>
              <option value="category-asc">Kategori A-Z</option>
              <option value="color-asc">Warna A-Z</option>
              <option value="price-desc">Harga tertinggi</option>
              <option value="price-asc">Harga terendah</option>
            </select>
            <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <ViewButton
                active={viewMode === "list"}
                label="List"
                onClick={() => setViewMode("list")}
              >
                <List />
              </ViewButton>
              <ViewButton
                active={viewMode === "card"}
                label="Card"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid />
              </ViewButton>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {filteredProducts.length} dari {products.length} produk
            </span>
            {searchQuery || categoryFilter !== "Semua" || sortKey !== "updated-desc" ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("Semua");
                  setSortKey("updated-desc");
                }}
              >
                <X className="size-4" />
                Reset filter
              </button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-slate-950">Produk tidak ditemukan</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Coba ubah kata kunci atau kategori filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-2">
            <div className={viewMode === "card" ? "grid gap-2 md:grid-cols-3" : "grid gap-1.5"}>
              {paginatedProducts.map((product) =>
                viewMode === "card" ? (
                  <ProductCardItem
                    key={product.id}
                    deleting={deletingProductId === product.id}
                    product={product}
                    selected={selectedProduct?.id === product.id}
                    onDelete={() => requestDelete(product)}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                ) : (
                  <ProductListItem
                    key={product.id}
                    deleting={deletingProductId === product.id}
                    product={product}
                    selected={selectedProduct?.id === product.id}
                    onDelete={() => requestDelete(product)}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                ),
              )}
            </div>
            <PaginationControls
              currentPage={currentPage}
              pageEnd={pageEnd}
              pageStart={pageStart}
              totalItems={filteredProducts.length}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {selectedProduct ? (
            <ProductDetailPanel
              product={selectedProduct}
              deleting={deletingProductId === selectedProduct.id}
              onDelete={() => requestDelete(selectedProduct)}
              onClose={() => setSelectedProductId("")}
            />
          ) : null}
        </div>
      )}
      </div>
      <DeleteProductModal
        error={deleteError}
        loading={Boolean(pendingDeleteProduct && deletingProductId === pendingDeleteProduct.id)}
        product={pendingDeleteProduct}
        onCancel={() => {
          if (deletingProductId) {
            return;
          }

          setPendingDeleteProduct(null);
          setDeleteError("");
        }}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}

function ViewButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Tampilan ${label}`}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition",
        active ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-800",
      )}
    >
      {children}
      {label}
    </button>
  );
}

function DeleteProductModal({
  error,
  loading,
  product,
  onCancel,
  onConfirm,
}: {
  error: string;
  loading: boolean;
  product: Product | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) {
      return;
    }

    cancelButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [loading, onCancel, product]);

  if (!product) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        className="w-full rounded-t-lg border border-slate-200 bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-lg"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <AlertTriangle className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 id="delete-product-title" className="text-lg font-extrabold text-slate-950">
              Hapus produk?
            </h2>
            <p id="delete-product-description" className="mt-2 text-sm leading-6 text-slate-600">
              Produk ini akan dihapus dari admin dan katalog publik setelah konfirmasi.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-950">{product.name}</p>
          <p className="mt-1 text-sm font-semibold text-red-700">{product.kodeProduksi}</p>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
            {error}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            <Trash2 />
            {loading ? "Menghapus..." : "Hapus Produk"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function compareProducts(left: Product, right: Product, sortKey: SortKey) {
  switch (sortKey) {
    case "name-asc":
      return compareText(left.name, right.name);
    case "name-desc":
      return compareText(right.name, left.name);
    case "code-asc":
      return compareText(left.kodeProduksi, right.kodeProduksi);
    case "code-desc":
      return compareText(right.kodeProduksi, left.kodeProduksi);
    case "period-desc":
      return comparePeriod(right.periodeProduksi, left.periodeProduksi);
    case "period-asc":
      return comparePeriod(left.periodeProduksi, right.periodeProduksi);
    case "category-asc":
      return compareText(left.category, right.category) || compareText(left.name, right.name);
    case "color-asc":
      return compareText(left.colors[0] ?? "", right.colors[0] ?? "") || compareText(left.name, right.name);
    case "price-desc":
      return right.harga - left.harga;
    case "price-asc":
      return left.harga - right.harga;
    case "updated-desc":
    default:
      return compareDate(right.updatedAt, left.updatedAt) || compareText(left.name, right.name);
  }
}

function compareText(left: string, right: string) {
  return left.localeCompare(right, "id", { sensitivity: "base", numeric: true });
}

function compareDate(left?: string, right?: string) {
  return new Date(left ?? 0).getTime() - new Date(right ?? 0).getTime();
}

function comparePeriod(left: string, right: string) {
  return periodToSortableNumber(left) - periodToSortableNumber(right);
}

function periodToSortableNumber(value: string) {
  const [month, year] = value.split("-").map(Number);
  return (year || 0) * 100 + (month || 0);
}

function PaginationControls({
  currentPage,
  pageEnd,
  pageStart,
  totalItems,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  pageEnd: number;
  pageStart: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Menampilkan {pageStart}-{pageEnd} dari {totalItems} produk
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
          Sebelumnya
        </Button>
        <span className="min-w-14 text-center text-xs font-semibold text-slate-700">
          {currentPage}/{totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Berikutnya
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

function ProductListItem({
  deleting,
  product,
  selected,
  onDelete,
  onClick,
}: {
  deleting: boolean;
  product: Product;
  selected: boolean;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "grid w-full gap-2 rounded-lg border bg-white p-2 text-left transition hover:border-sky-200 hover:shadow-soft sm:grid-cols-[3.5rem_1fr_auto] sm:items-center",
        selected ? "border-sky-300 shadow-soft" : "border-slate-200",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="relative aspect-square overflow-hidden rounded-md bg-sky-50 text-left"
        aria-label={`Lihat detail ${product.name}`}
      >
        <ProductCardMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
        />
      </button>
      <button type="button" onClick={onClick} className="min-w-0 text-left">
        <span className="flex flex-wrap items-center gap-1.5">
          <Badge>{product.category}</Badge>
          <Badge variant="secondary">{product.stockStatus}</Badge>
        </span>
        <span className="mt-1 block truncate text-sm font-bold text-slate-950">
          {product.name}
        </span>
        <span className="mt-0.5 block text-xs font-semibold text-sky-700">
          {product.kodeProduksi}
        </span>
        <span className="hidden text-xs leading-5 text-slate-600 2xl:mt-0.5 2xl:line-clamp-1 2xl:block">
          {product.description}
        </span>
      </button>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <button type="button" onClick={onClick} className="text-xs font-bold text-slate-950">
          {formatRupiah(product.harga)}
        </button>
        <ProductQuickActions deleting={deleting} product={product} onDelete={onDelete} />
      </div>
    </div>
  );
}

function ProductCardItem({
  deleting,
  product,
  selected,
  onDelete,
  onClick,
}: {
  deleting: boolean;
  product: Product;
  selected: boolean;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-white text-left transition hover:border-sky-200 hover:shadow-soft",
        selected ? "border-sky-300 shadow-soft" : "border-slate-200",
      )}
    >
      <div className="absolute right-2 top-2 z-10">
        <ProductQuickActions deleting={deleting} product={product} onDelete={onDelete} />
      </div>
      <button
        type="button"
        onClick={onClick}
        className="relative block aspect-[16/7] w-full overflow-hidden bg-sky-50 text-left"
        aria-label={`Lihat detail ${product.name}`}
      >
        <ProductCardMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
        />
      </button>
      <button type="button" onClick={onClick} className="block w-full p-2 text-left">
        <span className="flex flex-wrap items-center gap-1.5">
          <Badge>{product.category}</Badge>
          <Badge variant="secondary">{product.stockStatus}</Badge>
        </span>
        <span className="mt-1 line-clamp-1 block text-sm font-bold leading-5 text-slate-950">
          {product.name}
        </span>
        <span className="mt-0.5 block text-xs font-semibold text-sky-700">
          {product.kodeProduksi}
        </span>
        <span className="mt-1 block text-xs font-bold text-slate-950">{formatRupiah(product.harga)}</span>
      </button>
    </div>
  );
}

function ProductQuickActions({
  deleting,
  product,
  onDelete,
}: {
  deleting: boolean;
  product: Product;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        asChild
        type="button"
        variant="outline"
        size="icon"
        className="size-8 bg-white/95"
        title={`Edit ${product.name}`}
      >
        <Link href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`}>
          <Edit3 />
        </Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8 bg-white/95 text-red-600 hover:border-red-200 hover:text-red-700"
        disabled={deleting}
        title={`Hapus ${product.name}`}
        aria-label={`Hapus ${product.name}`}
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

function ProductDetailPanel({
  product,
  deleting,
  onDelete,
  onClose,
}: {
  product: Product;
  deleting: boolean;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <Card className="h-fit max-h-[calc(100vh-6rem)] overflow-hidden xl:sticky xl:top-3">
      <div className="relative aspect-[16/8] max-h-40 overflow-hidden bg-sky-50">
        <ProductDetailMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
          priority
        />
      </div>
      <CardContent className="grid max-h-[calc(100vh-16rem)] gap-2.5 overflow-y-auto p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge>{product.category}</Badge>
              <Badge variant="secondary">{product.stockStatus}</Badge>
            </div>
            <h2 className="mt-1.5 line-clamp-2 text-base font-extrabold leading-5 text-slate-950">
              {product.name}
            </h2>
            <p className="mt-1 text-xs font-semibold text-sky-700">{product.kodeProduksi}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Tutup detail">
            <X />
          </Button>
        </div>

        <p className="line-clamp-2 text-xs leading-5 text-slate-600">{product.description}</p>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <ProductMeta label="Harga" value={formatRupiah(product.harga)} strong />
          <ProductMeta label="Periode" value={product.periodeProduksi} />
          <ProductMeta label="Material" value={product.material} />
          <ProductMeta label="Dilihat" value={`${product.views} kali`} />
        </div>

        <div className="grid gap-2">
          <TagGroup label="Ukuran" values={product.sizes} />
          <TagGroup label="Warna" values={product.colors} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit3 />
              Edit Produk
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            onClick={onDelete}
          >
            <Trash2 />
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductMeta({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={cn("mt-0.5 line-clamp-1 text-slate-700", strong ? "font-bold text-slate-950" : "font-semibold")}>
        {value}
      </p>
    </div>
  );
}

function TagGroup({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {values.map((value) => (
          <Badge key={value} variant="outline">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}
