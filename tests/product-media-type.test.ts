import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_PRODUCT_MEDIA_TYPE,
  getMediaUrlHelpText,
  getMediaUrlPlaceholder,
  getPreviewMediaType,
} from "@/lib/product-media-type";
import { productInputSchema } from "@/lib/validation";

const baseProductInput = {
  name: "Gamis Seragam Biru",
  category: "Gamis",
  description: "Produk konveksi siap produksi.",
  mediaUrl: "https://example.com/foto-produk.jpg",
  galleryUrls: [],
  kodeProduksi: "GMS-1024-01",
  periodeProduksi: "05-2026",
  harga: 150000,
  stockStatus: "Ready",
  material: "Toyobo premium",
  sizes: ["M", "L"],
  colors: ["Biru"],
};

test("new products default to image media type", () => {
  assert.equal(DEFAULT_PRODUCT_MEDIA_TYPE, "image");
});

test("productInputSchema accepts image media type", () => {
  const parsed = productInputSchema.parse({
    ...baseProductInput,
    mediaType: "image",
  });

  assert.equal(parsed.mediaType, "image");
});

test("productInputSchema accepts video media type", () => {
  const parsed = productInputSchema.parse({
    ...baseProductInput,
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/shorts/T9X5KVfryAY",
  });

  assert.equal(parsed.mediaType, "video");
});

test("productInputSchema rejects unsupported media type", () => {
  const result = productInputSchema.safeParse({
    ...baseProductInput,
    mediaType: "audio",
  });

  assert.equal(result.success, false);
});

test("media helper returns image-specific copy", () => {
  assert.equal(getMediaUrlPlaceholder("image"), "https://example.com/foto-produk.jpg");
  assert.match(getMediaUrlHelpText("image"), /URL gambar langsung/);
});

test("media helper returns video-specific copy", () => {
  assert.equal(getMediaUrlPlaceholder("video"), "https://www.youtube.com/shorts/T9X5KVfryAY");
  assert.match(getMediaUrlHelpText("video"), /YouTube Shorts/);
});

test("preview uses selected media type only for primary media", () => {
  assert.equal(getPreviewMediaType(0, "image"), "image");
  assert.equal(getPreviewMediaType(0, "video"), "video");
  assert.equal(getPreviewMediaType(1, "video"), "image");
  assert.equal(getPreviewMediaType(2, "image"), "image");
});
