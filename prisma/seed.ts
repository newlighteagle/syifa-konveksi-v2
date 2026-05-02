import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { products } from "../lib/products";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@syifakonveksi.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Syifa Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.id },
      update: {
        name: product.name,
        category: product.category,
        description: product.description,
        mediaType: product.mediaType,
        mediaUrl: product.mediaUrl,
        galleryUrls: product.galleryUrls,
        kodeProduksi: product.kodeProduksi,
        periodeProduksi: product.periodeProduksi,
        harga: product.harga,
        stockStatus: product.stockStatus,
        publicationStatus: product.publicationStatus,
        material: product.material,
        sizes: product.sizes,
        colors: product.colors,
        views: product.views,
        inquiries: product.inquiries,
        createdById: admin.id,
      },
      create: {
        slug: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        mediaType: product.mediaType,
        mediaUrl: product.mediaUrl,
        galleryUrls: product.galleryUrls,
        kodeProduksi: product.kodeProduksi,
        periodeProduksi: product.periodeProduksi,
        harga: product.harga,
        stockStatus: product.stockStatus,
        publicationStatus: product.publicationStatus,
        material: product.material,
        sizes: product.sizes,
        colors: product.colors,
        views: product.views,
        inquiries: product.inquiries,
        createdById: admin.id,
      },
    });
  }

  console.log(`Seeded admin ${email} and ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
