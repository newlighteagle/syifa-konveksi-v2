import type { Product } from "@/lib/products";

const PRODUCT_CSV_COLUMNS = [
  "name",
  "kodeProduksi",
  "category",
  "stockStatus",
  "publicationStatus",
  "harga",
  "views",
  "inquiries",
  "updatedAt",
] as const;

export function buildProductsCsv(products: Product[]) {
  const rows = products.map((product) =>
    [
      product.name,
      product.kodeProduksi,
      product.category,
      product.stockStatus,
      product.publicationStatus,
      product.harga,
      product.views,
      product.inquiries,
      product.updatedAt ?? "",
    ].map(formatCsvCell),
  );

  return [
    PRODUCT_CSV_COLUMNS.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
}

function formatCsvCell(value: string | number) {
  const text = String(value);

  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}
