import type { Category, Color, Product as PrismaProduct, ProductColor } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { products, type Product } from "@/lib/products";

type ProductWithEnums = PrismaProduct & {
  mediaType: "image" | "video";
  stockStatus: "Ready" | "Preorder" | "Terbatas";
  categoryRef?: Category | null;
  colorLinks?: Array<ProductColor & { color: Color }>;
};

function fromPrisma(product: ProductWithEnums): Product {
  return {
    id: product.slug,
    name: product.name,
    category: product.categoryRef?.name ?? product.category,
    description: product.description,
    mediaType: product.mediaType,
    mediaUrl: product.mediaUrl,
    galleryUrls: product.galleryUrls,
    kodeProduksi: product.kodeProduksi,
    periodeProduksi: product.periodeProduksi,
    harga: product.harga,
    stockStatus: product.stockStatus,
    material: product.material,
    sizes: product.sizes,
    colors: product.colorLinks?.map((link) => link.color.name) ?? product.colors,
    views: product.views,
    inquiries: product.inquiries,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
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
          ? {
              OR: [
                { category: options.category },
                { categoryRef: { name: options.category } },
              ],
            }
          : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
              { categoryRef: { name: { contains: query, mode: "insensitive" } } },
                { description: { contains: query, mode: "insensitive" } },
                { kodeProduksi: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        categoryRef: true,
        colorLinks: { include: { color: true } },
      },
      orderBy: { updatedAt: "desc" },
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
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categoryRef: true,
        colorLinks: { include: { color: true } },
      },
    });
    return product ? fromPrisma(product as ProductWithEnums) : null;
  } catch (error) {
    console.error("Falling back to mock product:", error);
    return products.find((product) => product.id === slug) ?? null;
  }
}

export async function incrementProductViews(slug: string) {
  if (!hasDatabaseUrl()) {
    return;
  }

  try {
    await prisma.product.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Unable to increment product views:", error);
  }
}

export async function incrementProductInquiries(slug: string) {
  if (!hasDatabaseUrl()) {
    return;
  }

  try {
    await prisma.product.update({
      where: { slug },
      data: { inquiries: { increment: 1 } },
    });
  } catch (error) {
    console.error("Unable to increment product inquiries:", error);
  }
}

export async function listCategories() {
  return ["Semua", ...(await listCategoryOptions()).map((category) => category.name)];
}

export async function listCategoryOptions() {
  if (!hasDatabaseUrl()) {
    return Array.from(new Set(products.map((product) => product.category))).map((name) => ({
      id: name,
      name,
    }));
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return categories.map((category) => ({ id: category.id, name: category.name }));
}

export async function listColorOptions() {
  if (!hasDatabaseUrl()) {
    return Array.from(new Set(products.flatMap((product) => product.colors))).map((name) => ({
      id: name,
      name,
    }));
  }

  const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
  return colors.map((color) => ({ id: color.id, name: color.name }));
}

export async function resolveCategory(name: string) {
  const normalizedName = name.trim();
  return prisma.category.upsert({
    where: { name: normalizedName },
    update: {},
    create: { name: normalizedName },
  });
}

export async function resolveColors(names: string[]) {
  const uniqueNames = Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)));
  return Promise.all(
    uniqueNames.map((name) =>
      prisma.color.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
}
