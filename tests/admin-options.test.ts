import assert from "node:assert/strict";
import test from "node:test";

import { listManagedCategories, listManagedColors, OptionInUseError } from "@/lib/product-service";
import { optionNameSchema } from "@/lib/validation";

test("optionNameSchema trims option names", () => {
  const parsed = optionNameSchema.parse({ name: "  Navy Blue  " });

  assert.equal(parsed.name, "Navy Blue");
});

test("optionNameSchema rejects empty option names", () => {
  const result = optionNameSchema.safeParse({ name: "   " });

  assert.equal(result.success, false);
});

test("managed category and color lists fall back to mock data without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const [categories, colors] = await Promise.all([listManagedCategories(), listManagedColors()]);

    assert.ok(categories.some((category) => category.productCount > 0));
    assert.ok(colors.some((color) => color.productCount > 0));
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});

test("OptionInUseError explains that deletion is blocked", () => {
  const error = new OptionInUseError("kategori");

  assert.match(error.message, /masih dipakai produk/);
});
