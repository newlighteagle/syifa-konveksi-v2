import assert from "node:assert/strict";
import test from "node:test";

import { incrementProductInquiries } from "@/lib/product-service";
import { products } from "@/lib/products";

test("incrementProductInquiries is a safe no-op without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const originalInquiries = products[0]?.inquiries;

  try {
    await assert.doesNotReject(() => incrementProductInquiries("gamis-safira-premium"));
    assert.equal(products[0]?.inquiries, originalInquiries);
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});
