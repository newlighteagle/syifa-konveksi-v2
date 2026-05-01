import { NextResponse } from "next/server";

import { readSession } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { listProducts, resolveCategory, resolveColors } from "@/lib/product-service";
import { productInputSchema, slugify } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = await listProducts({
    query: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await readSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL belum disiapkan. Mode mock hanya mendukung baca data." },
      { status: 503 },
    );
  }

  const parsed = productInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data produk tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const slug = slugify(data.name);
  const category = await resolveCategory(data.category);
  const colors = await resolveColors(data.colors);

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      mediaType: "video",
      categoryId: category.id,
      createdById: session.id,
      colorLinks: {
        create: colors.map((color) => ({
          colorId: color.id,
        })),
      },
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
