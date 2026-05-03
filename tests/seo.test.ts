import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  buildOrganizationJsonLd,
  buildProductBreadcrumbJsonLd,
  buildProductJsonLd,
  getCanonicalUrl,
  getProductOgImage,
  getProductSeoDescription,
} from "@/lib/seo";
import type { Product } from "@/lib/products";

const baseProduct: Product = {
  id: "baju-tani",
  name: "Baju Tani",
  category: "Seragam",
  description: "Seragam kerja lapangan bahan adem.",
  mediaType: "image",
  mediaUrl: "https://cdn.example.com/baju-tani.webp",
  galleryUrls: [],
  kodeProduksi: "BT-001",
  periodeProduksi: "05-2026",
  harga: 80000,
  stockStatus: "Ready",
  publicationStatus: "published",
  material: "Drill",
  sizes: ["M", "L"],
  colors: ["Hijau"],
  views: 0,
  inquiries: 0,
};

test("getCanonicalUrl builds production URLs", () => {
  assert.equal(getCanonicalUrl("/products/baju-tani"), `${SITE_URL}/products/baju-tani`);
});

test("getProductSeoDescription includes description, code, and price", () => {
  const description = getProductSeoDescription(baseProduct);

  assert.match(description, /Seragam kerja lapangan bahan adem/);
  assert.match(description, /BT-001/);
  assert.match(description, /Rp\s?80\.000/);
});

test("getProductOgImage uses direct product image URL", () => {
  assert.equal(getProductOgImage(baseProduct), "https://cdn.example.com/baju-tani.webp");
});

test("getProductOgImage falls back when media is not a direct image", () => {
  assert.equal(
    getProductOgImage({
      ...baseProduct,
      mediaType: "video",
      mediaUrl: "https://www.youtube.com/shorts/abc123",
    }),
    DEFAULT_OG_IMAGE,
  );
});

test("buildProductJsonLd includes product identity and IDR offer", () => {
  const productUrl = getCanonicalUrl("/products/baju-tani");
  const jsonLd = buildProductJsonLd(baseProduct, productUrl);

  assert.equal(jsonLd["@type"], "Product");
  assert.equal(jsonLd.name, "Baju Tani");
  assert.equal(jsonLd.sku, "BT-001");
  assert.equal(jsonLd.url, productUrl);
  assert.equal(jsonLd.offers.priceCurrency, "IDR");
  assert.equal(jsonLd.offers.price, 80000);
});

test("buildProductBreadcrumbJsonLd orders home, products, and product detail", () => {
  const productUrl = getCanonicalUrl("/products/baju-tani");
  const jsonLd = buildProductBreadcrumbJsonLd(baseProduct, productUrl);

  assert.deepEqual(
    jsonLd.itemListElement.map((item) => item.name),
    ["Beranda", "Produk", "Baju Tani"],
  );
  assert.equal(jsonLd.itemListElement[2].item, productUrl);
});

test("buildOrganizationJsonLd contains production URL and business WhatsApp", () => {
  const jsonLd = buildOrganizationJsonLd();

  assert.deepEqual(jsonLd["@type"], ["Organization", "LocalBusiness"]);
  assert.equal(jsonLd.url, SITE_URL);
  assert.equal(jsonLd.telephone, "+62 852-4176-7460");
});
