import type { Product } from "@/lib/products";

export type CategoryInsight = {
  category: string;
  count: number;
  percentage: number;
};

export type ConversionGapProduct = {
  id: string;
  name: string;
  kodeProduksi: string;
  views: number;
  inquiries: number;
  inquiryRate: number;
};

export type DraftSummary = {
  count: number;
  latestDrafts: Product[];
};

export function getTopPublishedCategories(products: Product[], limit = 3): CategoryInsight[] {
  const publishedProducts = products.filter(
    (product) => product.publicationStatus === "published",
  );
  const categoryCounts = new Map<string, number>();

  for (const product of publishedProducts) {
    categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + 1);
  }

  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: getPercentage(count, publishedProducts.length),
    }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category))
    .slice(0, limit);
}

export function getHighViewLowInquiryProducts(
  products: Product[],
  limit = 3,
): ConversionGapProduct[] {
  return products
    .filter((product) => product.publicationStatus === "published" && product.views > 0)
    .map((product) => ({
      id: product.id,
      name: product.name,
      kodeProduksi: product.kodeProduksi,
      views: product.views,
      inquiries: product.inquiries,
      inquiryRate: product.inquiries / product.views,
    }))
    .sort(
      (left, right) =>
        left.inquiryRate - right.inquiryRate ||
        right.views - left.views ||
        left.name.localeCompare(right.name),
    )
    .slice(0, limit);
}

export function getDraftSummary(products: Product[], limit = 3): DraftSummary {
  const draftProducts = products
    .filter((product) => product.publicationStatus === "draft")
    .sort((left, right) => getProductTimestamp(right) - getProductTimestamp(left));

  return {
    count: draftProducts.length,
    latestDrafts: draftProducts.slice(0, limit),
  };
}

function getPercentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getProductTimestamp(product: Product) {
  const timestamp = Date.parse(product.updatedAt ?? product.createdAt ?? "");

  return Number.isNaN(timestamp) ? 0 : timestamp;
}
