import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_CATALOG_CATEGORY,
  DEFAULT_CATALOG_SORT,
  buildCatalogSearchParams,
  filterAndSortProducts,
  parseCatalogSearchParams,
} from "@/lib/catalog-filters";
import type { Product } from "@/lib/products";

function createProduct({
  id,
  category = "Seragam",
  harga = 100000,
  views = 0,
  inquiries = 0,
  updatedAt = "2026-05-01T00:00:00.000Z",
}: {
  id: string;
  category?: string;
  harga?: number;
  views?: number;
  inquiries?: number;
  updatedAt?: string;
}): Product {
  return {
    id,
    name: id,
    category,
    description: `${id} produk konveksi`,
    mediaType: "image",
    mediaUrl: "https://cdn.example.com/product.jpg",
    galleryUrls: [],
    kodeProduksi: id.toUpperCase(),
    periodeProduksi: "05-2026",
    harga,
    stockStatus: "Ready",
    publicationStatus: "published",
    material: "Drill",
    sizes: [],
    colors: [],
    views,
    inquiries,
    updatedAt,
  };
}

test("parseCatalogSearchParams uses default category and sort", () => {
  assert.deepEqual(parseCatalogSearchParams(new URLSearchParams()), {
    query: "",
    category: DEFAULT_CATALOG_CATEGORY,
    sort: DEFAULT_CATALOG_SORT,
  });
});

test("buildCatalogSearchParams omits default values", () => {
  assert.equal(
    buildCatalogSearchParams({
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: DEFAULT_CATALOG_SORT,
    }).toString(),
    "",
  );
});

test("filterAndSortProducts matches keyword and category", () => {
  const products = [
    createProduct({ id: "kaos-komunitas", category: "Kaos" }),
    createProduct({ id: "seragam-sekolah", category: "Seragam" }),
  ];

  const filteredProducts = filterAndSortProducts(products, {
    query: "kaos",
    category: "Kaos",
    sort: "newest",
  });

  assert.deepEqual(
    filteredProducts.map((product) => product.id),
    ["kaos-komunitas"],
  );
});

test("filterAndSortProducts sorts by price, views, inquiries, and newest", () => {
  const products = [
    createProduct({
      id: "middle",
      harga: 100000,
      views: 50,
      inquiries: 2,
      updatedAt: "2026-05-02T00:00:00.000Z",
    }),
    createProduct({
      id: "highest",
      harga: 150000,
      views: 80,
      inquiries: 7,
      updatedAt: "2026-05-03T00:00:00.000Z",
    }),
    createProduct({
      id: "lowest",
      harga: 50000,
      views: 10,
      inquiries: 1,
      updatedAt: "2026-05-01T00:00:00.000Z",
    }),
  ];

  assert.deepEqual(
    filterAndSortProducts(products, {
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: "price_asc",
    }).map((product) => product.id),
    ["lowest", "middle", "highest"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, {
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: "price_desc",
    }).map((product) => product.id),
    ["highest", "middle", "lowest"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, {
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: "views_desc",
    }).map((product) => product.id),
    ["highest", "middle", "lowest"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, {
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: "inquiries_desc",
    }).map((product) => product.id),
    ["highest", "middle", "lowest"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, {
      query: "",
      category: DEFAULT_CATALOG_CATEGORY,
      sort: "newest",
    }).map((product) => product.id),
    ["highest", "middle", "lowest"],
  );
});
