import assert from "node:assert/strict";
import test from "node:test";

import { getProductBySlug, listProducts } from "@/lib/product-service";
import { products } from "@/lib/products";

test("public product queries hide draft products without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const product = products[0];
  const originalStatus = product.publicationStatus;
  delete process.env.DATABASE_URL;
  product.publicationStatus = "draft";

  try {
    const publicProducts = await listProducts();
    const adminProducts = await listProducts({ includeDrafts: true });
    const publicProduct = await getProductBySlug(product.id);
    const adminProduct = await getProductBySlug(product.id, { includeDrafts: true });

    assert.equal(publicProducts.some((item) => item.id === product.id), false);
    assert.equal(adminProducts.some((item) => item.id === product.id), true);
    assert.equal(publicProduct, null);
    assert.equal(adminProduct?.id, product.id);
  } finally {
    product.publicationStatus = originalStatus;
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});
