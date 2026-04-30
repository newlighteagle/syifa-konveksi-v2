"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export function CatalogPage({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return initialProducts.filter((product) => {
      const matchesCategory = category === "Semua" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.category, product.description, product.kodeProduksi]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, initialProducts, query]);

  return (
    <>
      <section className="container py-14 text-center sm:py-20">
        <Badge className="gap-2 px-4 py-2">
          <Sparkles className="size-4" />
          Katalog digital Syifa Konveksi
        </Badge>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
          Temukan model baju produksi terbaru dengan cepat.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Cari gamis, seragam, kemeja, dan produk konveksi lain dengan tampilan bersih
          bertema biru langit.
        </p>
        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-airy">
          <Search className="ml-3 size-5 shrink-0 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="border-0 bg-transparent text-base focus-visible:ring-0"
            placeholder="Cari nama produk, kategori, atau kode produksi..."
          />
          <Button className="hidden sm:inline-flex">Cari</Button>
        </div>
      </section>

      <section id="koleksi" className="container pb-16">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700">Koleksi Produk</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
              {filteredProducts.length} produk ditemukan
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={
                  item === category
                    ? "rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-soft"
                    : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
