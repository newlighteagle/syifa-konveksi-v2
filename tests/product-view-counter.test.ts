import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "@/app/api/products/[slug]/views/route";
import { incrementProductViews } from "@/lib/product-service";
import { products } from "@/lib/products";

test("incrementProductViews is a safe no-op without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const originalViews = products[0]?.views;

  try {
    await assert.doesNotReject(() =>
      incrementProductViews("baju-tani-safira-premium"),
    );
    assert.equal(products[0]?.views, originalViews);
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});

test("POST /api/products/:slug/views records views as a safe no-op without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const response = await POST(
      new Request(
        "https://www.syifakonveksi.my.id/api/products/baju-tani-safira-premium/views",
        {
          method: "POST",
        },
      ),
      { params: Promise.resolve({ slug: "baju-tani-safira-premium" }) },
    );

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});
