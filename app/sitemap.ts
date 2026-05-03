import type { MetadataRoute } from "next";

import { listProducts } from "@/lib/product-service";
import { getCanonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();

  return [
    {
      url: getCanonicalUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((product) => ({
      url: getCanonicalUrl(`/products/${product.id}`),
      lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
