import assert from "node:assert/strict";
import test from "node:test";

import {
  getDraftSummary,
  getHighViewLowInquiryProducts,
  getTopPublishedCategories,
} from "@/lib/dashboard-insights";
import type { Product } from "@/lib/products";

function createProduct({
  id,
  category = "Seragam",
  publicationStatus = "published",
  views = 0,
  inquiries = 0,
  updatedAt = "2026-05-01T00:00:00.000Z",
}: {
  id: string;
  category?: string;
  publicationStatus?: Product["publicationStatus"];
  views?: number;
  inquiries?: number;
  updatedAt?: string;
}): Product {
  return {
    id,
    name: id,
    category,
    description: "Produk uji dashboard",
    mediaType: "image",
    mediaUrl: "https://cdn.example.com/product.jpg",
    galleryUrls: [],
    kodeProduksi: id.toUpperCase(),
    periodeProduksi: "05-2026",
    harga: 100000,
    stockStatus: "Ready",
    publicationStatus,
    material: "Drill",
    sizes: [],
    colors: [],
    views,
    inquiries,
    updatedAt,
  };
}

test("getTopPublishedCategories counts published products only", () => {
  const insights = getTopPublishedCategories([
    createProduct({ id: "seragam-1", category: "Seragam" }),
    createProduct({ id: "seragam-2", category: "Seragam" }),
    createProduct({ id: "kaos-1", category: "Kaos" }),
    createProduct({ id: "draft-1", category: "Kaos", publicationStatus: "draft" }),
  ]);

  assert.deepEqual(insights, [
    { category: "Seragam", count: 2, percentage: 67 },
    { category: "Kaos", count: 1, percentage: 33 },
  ]);
});

test("getHighViewLowInquiryProducts prioritizes low inquiry rate and high views", () => {
  const products = [
    createProduct({ id: "balanced", views: 100, inquiries: 10 }),
    createProduct({ id: "gap-high", views: 200, inquiries: 0 }),
    createProduct({ id: "gap-low", views: 50, inquiries: 0 }),
    createProduct({ id: "draft-gap", publicationStatus: "draft", views: 300, inquiries: 0 }),
    createProduct({ id: "no-views", views: 0, inquiries: 0 }),
  ];

  const insights = getHighViewLowInquiryProducts(products);

  assert.deepEqual(
    insights.map((product) => product.id),
    ["gap-high", "gap-low", "balanced"],
  );
  assert.equal(insights[0].inquiryRate, 0);
});

test("getDraftSummary returns latest drafts and empty state data", () => {
  const summary = getDraftSummary([
    createProduct({
      id: "draft-old",
      publicationStatus: "draft",
      updatedAt: "2026-05-01T00:00:00.000Z",
    }),
    createProduct({
      id: "draft-new",
      publicationStatus: "draft",
      updatedAt: "2026-05-03T00:00:00.000Z",
    }),
    createProduct({ id: "published", publicationStatus: "published" }),
  ]);

  assert.equal(summary.count, 2);
  assert.deepEqual(
    summary.latestDrafts.map((product) => product.id),
    ["draft-new", "draft-old"],
  );
  assert.deepEqual(getDraftSummary([]), { count: 0, latestDrafts: [] });
});
