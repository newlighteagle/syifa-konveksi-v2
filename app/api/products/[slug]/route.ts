import { NextResponse } from "next/server";

import { readSession } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { getProductBySlug, resolveCategory, resolveColors } from "@/lib/product-service";
import { productInputSchema, slugify } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
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

  const { slug } = await params;
  const parsed = productInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data produk tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const category = await resolveCategory(data.category);
  const colors = await resolveColors(data.colors);
  const product = await prisma.product.update({
    where: { slug },
    data: {
      ...data,
      slug: slugify(data.name),
      mediaType: data.mediaType,
      categoryId: category.id,
      colorLinks: {
        deleteMany: {},
        create: colors.map((color) => ({
          colorId: color.id,
        })),
      },
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await readSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "DATABASE_URL belum disiapkan. Mode mock hanya mendukung hapus visual di client." },
      { status: 503 },
    );
  }

  const { slug } = await params;
  await prisma.product.delete({ where: { slug } });

  return NextResponse.json({ ok: true });
}
