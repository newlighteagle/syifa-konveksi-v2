import type { Product } from "@/lib/products";

export const DEFAULT_CATALOG_CATEGORY = "Semua";
export const DEFAULT_CATALOG_SORT = "newest";

export const CATALOG_SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga terendah" },
  { value: "price_desc", label: "Harga tertinggi" },
  { value: "views_desc", label: "Paling dilihat" },
  { value: "inquiries_desc", label: "Paling ditanyakan" },
] as const;

export type CatalogSortValue = (typeof CATALOG_SORT_OPTIONS)[number]["value"];

export type CatalogFilterState = {
  query: string;
  category: string;
  sort: CatalogSortValue;
};

export function parseCatalogSearchParams(searchParams: URLSearchParams): CatalogFilterState {
  const sort = searchParams.get("sort");

  return {
    query: searchParams.get("q")?.trim() ?? "",
    category: searchParams.get("category")?.trim() || DEFAULT_CATALOG_CATEGORY,
    sort: isCatalogSortValue(sort) ? sort : DEFAULT_CATALOG_SORT,
  };
}

export function buildCatalogSearchParams({
  query,
  category,
  sort,
}: CatalogFilterState) {
  const searchParams = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (normalizedQuery) {
    searchParams.set("q", normalizedQuery);
  }

  if (category && category !== DEFAULT_CATALOG_CATEGORY) {
    searchParams.set("category", category);
  }

  if (sort !== DEFAULT_CATALOG_SORT) {
    searchParams.set("sort", sort);
  }

  return searchParams;
}

export function filterAndSortProducts(products: Product[], filters: CatalogFilterState) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filters.category === DEFAULT_CATALOG_CATEGORY || product.category === filters.category;
    const matchesQuery =
      !normalizedQuery ||
      [product.name, product.category, product.description, product.kodeProduksi]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  return [...filteredProducts].sort((firstProduct, secondProduct) =>
    compareProducts(firstProduct, secondProduct, filters.sort),
  );
}

function isCatalogSortValue(value: string | null): value is CatalogSortValue {
  return CATALOG_SORT_OPTIONS.some((option) => option.value === value);
}

function compareProducts(
  firstProduct: Product,
  secondProduct: Product,
  sort: CatalogSortValue,
) {
  if (sort === "price_asc") {
    return firstProduct.harga - secondProduct.harga;
  }

  if (sort === "price_desc") {
    return secondProduct.harga - firstProduct.harga;
  }

  if (sort === "views_desc") {
    return secondProduct.views - firstProduct.views;
  }

  if (sort === "inquiries_desc") {
    return secondProduct.inquiries - firstProduct.inquiries;
  }

  return getProductTimestamp(secondProduct) - getProductTimestamp(firstProduct);
}

function getProductTimestamp(product: Product) {
  const timestamp = Date.parse(product.updatedAt ?? product.createdAt ?? "");

  return Number.isNaN(timestamp) ? 0 : timestamp;
}
