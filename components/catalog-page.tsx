"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, RotateCcw, Search, Send, Sparkles } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import {
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_CATEGORY,
  DEFAULT_CATALOG_SORT,
  type CatalogFilterState,
  type CatalogSortValue,
  buildCatalogSearchParams,
  filterAndSortProducts,
  parseCatalogSearchParams,
} from "@/lib/catalog-filters";
import type { Product } from "@/lib/products";
import {
  buildGeneralContactMessage,
  buildHeroCtaMessage,
  buildWhatsAppUrl,
  getBusinessWhatsAppNumber,
} from "@/lib/whatsapp";

const HERO_IMAGES = [
  "/hero-konveksi-1.jpeg",
  "/hero-konveksi-2.jpeg",
  "/hero-konveksi-3.jpeg",
];

export function CatalogPage({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsSnapshot = searchParams.toString();
  const filters = useMemo(
    () => parseCatalogSearchParams(new URLSearchParams(searchParamsSnapshot)),
    [searchParamsSnapshot],
  );
  const [draftQuery, setDraftQuery] = useState(filters.query);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: getBusinessWhatsAppNumber(),
    message: buildGeneralContactMessage(),
  });
  const heroCtaUrl = buildWhatsAppUrl({
    phoneNumber: getBusinessWhatsAppNumber(),
    message: buildHeroCtaMessage(),
  });

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(initialProducts, filters);
  }, [filters, initialProducts]);

  useEffect(() => {
    setDraftQuery(filters.query);
  }, [filters.query]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroIndex(
        (currentIndex) => (currentIndex + 1) % HERO_IMAGES.length,
      );
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const hasActiveFilters =
    filters.query !== "" ||
    filters.category !== DEFAULT_CATALOG_CATEGORY ||
    filters.sort !== DEFAULT_CATALOG_SORT;

  function updateFilters(nextFilters: CatalogFilterState) {
    const nextSearchParams = buildCatalogSearchParams(nextFilters);
    const nextUrl = nextSearchParams.toString()
      ? `${pathname}?${nextSearchParams.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  }

  function updateQuery(nextQuery: string) {
    setDraftQuery(nextQuery);
    updateFilters({ ...filters, query: nextQuery });
  }

  function updateCategory(nextCategory: string) {
    updateFilters({ ...filters, category: nextCategory });
  }

  function updateSort(nextSort: CatalogSortValue) {
    updateFilters({ ...filters, sort: nextSort });
  }

  function resetFilters() {
    setDraftQuery("");
    updateFilters({
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: DEFAULT_CATALOG_SORT,
    });
  }

  return (
    <>
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        {HERO_IMAGES.map((imageSrc, imageIndex) => (
          <img
            key={imageSrc}
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className={
              imageIndex === activeHeroIndex
                ? "absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-1000"
                : "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
            }
            loading={imageIndex === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80" />
        <div className="container relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-16 text-center sm:py-24">
          <Badge className="gap-2 border-sky-400/30 bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
            <Sparkles className="size-4" />
            Katalog digital Syifa Konveksi
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Konveksi terpercaya untuk seragam, kaos, dan baju custom.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Produksi berkualitas dari Syifa Konveksi — baju tani, kaos
            komunitas, dan berbagai model baju siap dipesan atau custom sesuai
            kebutuhan. Desain cantik, kualitas terbaik, dan konsultasi gratis
            untuk hasil memuaskan.
          </p>
          <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {heroCtaUrl ? (
              <Button
                asChild
                size="lg"
                className="bg-green-600 text-base font-bold hover:bg-green-700"
              >
                <a href={heroCtaUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Konsultasi Desain Gratis
                </a>
              </Button>
            ) : null}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base font-bold"
            >
              <a href="#koleksi">Lihat Katalog</a>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="koleksi"
        className="container scroll-mt-24 pt-8 pb-16 sm:pt-10"
      >
        <div className="mx-auto mb-6 flex w-full max-w-2xl items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-airy">
          <Search className="ml-3 size-5 shrink-0 text-slate-400" />
          <Input
            value={draftQuery}
            onChange={(event) => updateQuery(event.target.value)}
            className="border-0 bg-transparent text-base focus-visible:ring-0"
            placeholder="Cari nama produk, kategori, atau kode produksi..."
          />
          <Button className="hidden sm:inline-flex" aria-label="Cari produk">
            Cari
          </Button>
        </div>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700">Koleksi Produk</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
              {filteredProducts.length} produk ditemukan
            </h2>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              Urutkan
              <select
                value={filters.sort}
                onChange={(event) =>
                  updateSort(event.target.value as CatalogSortValue)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-sky-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                {CATALOG_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => updateCategory(item)}
                  className={
                    item === filters.category
                      ? "rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-soft"
                      : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                  }
                >
                  {item}
                </button>
              ))}
              {hasActiveFilters ? (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <RotateCcw />
                  Reset
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center shadow-soft">
            <p className="text-sm font-semibold text-sky-700">
              Produk belum ditemukan
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              Coba kata kunci atau kategori lain.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Tidak ada produk yang cocok dengan filter saat ini. Tim Syifa
              Konveksi tetap bisa bantu cek model, bahan, ukuran, dan kebutuhan
              custom.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={resetFilters}>
                <RotateCcw />
                Reset filter
              </Button>
              {whatsappUrl ? (
                <Button asChild>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Send />
                    Konsultasi WhatsApp
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
