import assert from "node:assert/strict";
import test from "node:test";

import { buildProductShareData } from "@/lib/share";

test("buildProductShareData includes product identity and URL", () => {
  const shareData = buildProductShareData({
    name: "Baju Tani",
    kodeProduksi: "BT-001",
    url: "https://www.syifakonveksi.my.id/products/baju-tani",
  });

  assert.equal(shareData.title, "Baju Tani - Syifa Konveksi");
  assert.equal(shareData.text, "Lihat produk Baju Tani (BT-001) dari Syifa Konveksi.");
  assert.equal(shareData.url, "https://www.syifakonveksi.my.id/products/baju-tani");
});
