import assert from "node:assert/strict";
import test from "node:test";

import { incrementProductViews } from "@/lib/product-service";
import { products } from "@/lib/products";

test("incrementProductViews is a safe no-op without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const originalViews = products[0]?.views;

  try {
    await assert.doesNotReject(() => incrementProductViews("gamis-safira-premium"));
    assert.equal(products[0]?.views, originalViews);
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});
