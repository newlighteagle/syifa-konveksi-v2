import assert from "node:assert/strict";
import test from "node:test";

import { getEmbeddedMediaProvider } from "@/lib/media";

test("getEmbeddedMediaProvider detects YouTube URLs", () => {
  assert.equal(getEmbeddedMediaProvider("https://www.youtube.com/shorts/T9X5KVfryAY"), "YouTube");
  assert.equal(getEmbeddedMediaProvider("https://youtu.be/T9X5KVfryAY"), "YouTube");
});

test("getEmbeddedMediaProvider detects Instagram URLs", () => {
  assert.equal(getEmbeddedMediaProvider("https://www.instagram.com/reel/ABC123/"), "Instagram");
});

test("getEmbeddedMediaProvider ignores direct media URLs", () => {
  assert.equal(getEmbeddedMediaProvider("https://cdn.example.com/katalog/foto.jpg"), null);
  assert.equal(getEmbeddedMediaProvider("https://cdn.example.com/katalog/video.mp4"), null);
});
