import assert from "node:assert/strict";
import test from "node:test";

import { buildProductsCsv } from "@/lib/product-export";
import type { Product } from "@/lib/products";

const product: Product = {
  id: "baju-tani",
  name: 'Baju Tani, "Premium"',
  category: "Seragam",
  description: "Produk uji",
  mediaType: "image",
  mediaUrl: "https://cdn.example.com/product.jpg",
  galleryUrls: [],
  kodeProduksi: "BT-001",
  periodeProduksi: "05-2026",
  harga: 80000,
  stockStatus: "Ready",
  publicationStatus: "published",
  material: "Drill",
  sizes: [],
  colors: [],
  views: 12,
  inquiries: 3,
  updatedAt: "2026-05-03T00:00:00.000Z",
};

test("buildProductsCsv exports expected columns and escapes values", () => {
  const csv = buildProductsCsv([product]);

  assert.equal(
    csv,
    [
      "name,kodeProduksi,category,stockStatus,publicationStatus,harga,views,inquiries,updatedAt",
      '"Baju Tani, ""Premium""",BT-001,Seragam,Ready,published,80000,12,3,2026-05-03T00:00:00.000Z',
    ].join("\n"),
  );
});
