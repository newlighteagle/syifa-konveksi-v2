import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProductInquiryMessage,
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
} from "@/lib/whatsapp";

test("normalizeWhatsAppNumber strips formatting and keeps country code", () => {
  assert.equal(normalizeWhatsAppNumber("+62 852-4176-7460"), "6285241767460");
});

test("normalizeWhatsAppNumber converts local zero prefix to Indonesia country code", () => {
  assert.equal(normalizeWhatsAppNumber("0852-4176-7460"), "6285241767460");
});

test("buildProductInquiryMessage includes product details", () => {
  const message = buildProductInquiryMessage({
    name: "Baju Tani",
    kodeProduksi: "SKU-001",
    harga: "Rp 80.000",
    url: "https://www.syifakonveksi.my.id/products/baju-tani",
  });

  assert.match(message, /Nama: Baju Tani/);
  assert.match(message, /Kode produksi: SKU-001/);
  assert.match(message, /Harga: Rp 80\.000/);
  assert.match(message, /Link produk: https:\/\/www\.syifakonveksi\.my\.id\/products\/baju-tani/);
});

test("buildWhatsAppUrl returns encoded wa.me URL", () => {
  const url = buildWhatsAppUrl({
    phoneNumber: "+62 852-4176-7460",
    message: "Halo\nTanya produk",
  });

  assert.equal(url, "https://wa.me/6285241767460?text=Halo%0ATanya%20produk");
});

test("buildWhatsAppUrl returns null without phone number", () => {
  assert.equal(buildWhatsAppUrl({ phoneNumber: "", message: "Halo" }), null);
});
