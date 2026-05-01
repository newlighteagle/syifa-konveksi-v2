"use client";

import Link from "next/link";
import {
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
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProductCardMedia, ProductDetailMedia } from "@/components/product-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/products";
import { cn, formatRupiah } from "@/lib/utils";

type ViewMode = "list" | "card";

type AdminProductsListProps = {
  products: Product[];
  categories: Array<{ id: string; name: string }>;
};

export function AdminProductsList({ products, categories }: AdminProductsListProps) {
  const router = useRouter();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === "card" ? 6 : 8;

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
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
  }, [categoryFilter, products, searchQuery]);

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
  }, [categoryFilter, searchQuery, viewMode]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Hapus produk "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingProductId(product.id);
    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    setDeletingProductId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      window.alert(body?.message ?? "Produk belum bisa dihapus.");
      return;
    }

    if (selectedProductId === product.id) {
      setSelectedProductId("");
    }
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
    <div className="grid gap-5">
      <Card>
        <CardContent className="grid gap-4 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_16rem_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
                placeholder="Cari nama, kode, bahan, ukuran, atau warna"
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
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
            <span>
              {filteredProducts.length} dari {products.length} produk
            </span>
            {searchQuery || categoryFilter !== "Semua" ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("Semua");
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
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div className={viewMode === "card" ? "grid gap-4 md:grid-cols-2" : "grid gap-3"}>
            {paginatedProducts.map((product) =>
              viewMode === "card" ? (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  selected={selectedProduct?.id === product.id}
                  onClick={() => setSelectedProductId(product.id)}
                />
              ) : (
                <ProductListItem
                  key={product.id}
                  product={product}
                  selected={selectedProduct?.id === product.id}
                  onClick={() => setSelectedProductId(product.id)}
                />
              ),
            )}
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
              onDelete={() => handleDelete(selectedProduct)}
              onClose={() => setSelectedProductId("")}
            />
          ) : null}
        </div>
      )}
    </div>
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
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
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
        <span className="min-w-16 text-center text-sm font-semibold text-slate-700">
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
  product,
  selected,
  onClick,
}: {
  product: Product;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid w-full gap-4 rounded-lg border bg-white p-4 text-left transition hover:border-sky-200 hover:shadow-soft sm:grid-cols-[6rem_1fr_auto] sm:items-center",
        selected ? "border-sky-300 shadow-soft" : "border-slate-200",
      )}
    >
      <span className="relative aspect-square overflow-hidden rounded-lg bg-sky-50">
        <ProductCardMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
        />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <Badge>{product.category}</Badge>
          <Badge variant="secondary">{product.stockStatus}</Badge>
        </span>
        <span className="mt-3 block truncate text-lg font-bold text-slate-950">
          {product.name}
        </span>
        <span className="mt-1 block text-sm font-semibold text-sky-700">
          {product.kodeProduksi}
        </span>
        <span className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.description}
        </span>
      </span>
      <span className="font-bold text-slate-950">{formatRupiah(product.harga)}</span>
    </button>
  );
}

function ProductCardItem({
  product,
  selected,
  onClick,
}: {
  product: Product;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "overflow-hidden rounded-lg border bg-white text-left transition hover:border-sky-200 hover:shadow-soft",
        selected ? "border-sky-300 shadow-soft" : "border-slate-200",
      )}
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-sky-50">
        <ProductCardMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
        />
      </span>
      <span className="block p-4">
        <span className="flex flex-wrap items-center gap-2">
          <Badge>{product.category}</Badge>
          <Badge variant="secondary">{product.stockStatus}</Badge>
        </span>
        <span className="mt-3 line-clamp-2 block text-lg font-bold leading-6 text-slate-950">
          {product.name}
        </span>
        <span className="mt-1 block text-sm font-semibold text-sky-700">
          {product.kodeProduksi}
        </span>
        <span className="mt-3 block font-bold text-slate-950">{formatRupiah(product.harga)}</span>
      </span>
    </button>
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
    <Card className="h-fit overflow-hidden xl:sticky xl:top-6">
      <div className="relative aspect-[4/3] overflow-hidden bg-sky-50">
        <ProductDetailMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
          priority
        />
      </div>
      <CardContent className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{product.category}</Badge>
              <Badge variant="secondary">{product.stockStatus}</Badge>
            </div>
            <h2 className="mt-3 text-xl font-extrabold leading-7 text-slate-950">
              {product.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-sky-700">{product.kodeProduksi}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Tutup detail">
            <X />
          </Button>
        </div>

        <p className="text-sm leading-6 text-slate-600">{product.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <ProductMeta label="Harga" value={formatRupiah(product.harga)} strong />
          <ProductMeta label="Periode" value={product.periodeProduksi} />
          <ProductMeta label="Material" value={product.material} />
          <ProductMeta label="Dilihat" value={`${product.views} kali`} />
        </div>

        <div className="grid gap-3">
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
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={cn("mt-1 text-slate-700", strong ? "font-bold text-slate-950" : "font-semibold")}>
        {value}
      </p>
    </div>
  );
}

function TagGroup({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} variant="outline">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}
