import { NextResponse } from "next/server";

import { readSession } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";
import { createCategoryOption, listCategoryOptions } from "@/lib/product-service";
import { optionNameSchema } from "@/lib/validation";

export async function GET() {
  const categories = await listCategoryOptions();
  return NextResponse.json({ categories });
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

  const parsed = optionNameSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Kategori tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const category = await createCategoryOption(parsed.data.name);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ message: "Kategori sudah ada." }, { status: 409 });
    }

    throw error;
  }
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
