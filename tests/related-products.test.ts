import assert from "node:assert/strict";
import test from "node:test";

import { getRelatedProducts } from "@/lib/related-products";
import type { Product } from "@/lib/products";

function createProduct(id: string, category = "Seragam", publicationStatus: Product["publicationStatus"] = "published"): Product {
  return {
    id,
    name: id,
    category,
    description: "Produk uji",
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
    views: 0,
    inquiries: 0,
  };
}

test("getRelatedProducts excludes current product, drafts, and other categories", () => {
  const currentProduct = createProduct("current");
  const related = getRelatedProducts({
    currentProduct,
    products: [
      currentProduct,
      createProduct("related-1"),
      createProduct("draft-product", "Seragam", "draft"),
      createProduct("other-category", "Kaos"),
    ],
  });

  assert.deepEqual(
    related.map((product) => product.id),
    ["related-1"],
  );
});

test("getRelatedProducts limits results to three products by default", () => {
  const currentProduct = createProduct("current");
  const related = getRelatedProducts({
    currentProduct,
    products: [
      currentProduct,
      createProduct("related-1"),
      createProduct("related-2"),
      createProduct("related-3"),
      createProduct("related-4"),
    ],
  });

  assert.deepEqual(
    related.map((product) => product.id),
    ["related-1", "related-2", "related-3"],
  );
});
