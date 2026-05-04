import assert from "node:assert/strict";
import test from "node:test";

import { getProductCardMediaSource } from "@/lib/product-card-media";

test("product card media uses thumbnail before video placeholder", () => {
  assert.deepEqual(
    getProductCardMediaSource({
      mediaType: "video",
      mediaUrl: "https://www.youtube.com/shorts/T9X5KVfryAY",
      thumbnailUrl: "https://cdn.example.com/produk-thumbnail.jpg",
    }),
    {
      kind: "image",
      source: "thumbnail",
      url: "https://cdn.example.com/produk-thumbnail.jpg",
    },
  );
});

test("product card media falls back to primary direct image", () => {
  assert.deepEqual(
    getProductCardMediaSource({
      mediaType: "image",
      mediaUrl: "https://cdn.example.com/produk.jpg",
      thumbnailUrl: null,
    }),
    {
      kind: "image",
      source: "primary-image",
      url: "https://cdn.example.com/produk.jpg",
    },
  );
});

test("product card media keeps video media as lightweight placeholder without thumbnail", () => {
  assert.deepEqual(
    getProductCardMediaSource({
      mediaType: "video",
      mediaUrl: "https://cdn.example.com/produk.mp4",
    }),
    {
      kind: "placeholder",
      source: "video",
      url: "https://cdn.example.com/produk.mp4",
    },
  );
});
