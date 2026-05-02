import { NextResponse } from "next/server";

import { readSession } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";
import { deleteColorOption, OptionInUseError } from "@/lib/product-service";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
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

  const { id } = await params;

  try {
    const color = await deleteColorOption(id);

    if (!color) {
      return NextResponse.json({ message: "Warna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof OptionInUseError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    throw error;
  }
}
