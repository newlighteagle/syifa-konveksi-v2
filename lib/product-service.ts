import type { Product as PrismaProduct } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { products, type Product } from "@/lib/products";

type ProductWithEnums = PrismaProduct & {
  mediaType: "image" | "video";
  stockStatus: "Ready" | "Preorder" | "Terbatas";
};

function fromPrisma(product: ProductWithEnums): Product {
  return {
    id: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    mediaType: product.mediaType,
    mediaUrl: product.mediaUrl,
    kodeProduksi: product.kodeProduksi,
    periodeProduksi: product.periodeProduksi,
    harga: product.harga,
    stockStatus: product.stockStatus,
    material: product.material,
    sizes: product.sizes,
    colors: product.colors,
    views: product.views,
  };
}

export async function listProducts(options?: { query?: string; category?: string }) {
  if (!hasDatabaseUrl()) {
    const query = options?.query?.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        !options?.category || options.category === "Semua" || product.category === options.category;
      const matchesQuery =
        !query ||
        [product.name, product.category, product.description, product.kodeProduksi]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  const query = options?.query?.trim();
  try {
    const rows = await prisma.product.findMany({
      where: {
        ...(options?.category && options.category !== "Semua"
          ? { category: options.category }
          : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { category: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { kodeProduksi: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => fromPrisma(row as ProductWithEnums));
  } catch (error) {
    console.error("Falling back to mock products:", error);
    return products;
  }
}

export async function getProductBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return products.find((product) => product.id === slug) ?? null;
  }

  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    return product ? fromPrisma(product as ProductWithEnums) : null;
  } catch (error) {
    console.error("Falling back to mock product:", error);
    return products.find((product) => product.id === slug) ?? null;
  }
}

export async function listCategories() {
  const productList = await listProducts();
  return ["Semua", ...Array.from(new Set(productList.map((product) => product.category)))];
}
