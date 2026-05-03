import { NextResponse } from "next/server";

import { readSession } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";
import { bulkUpdateProductPublicationStatus } from "@/lib/product-service";
import { bulkPublicationUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
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

  const parsed = bulkPublicationUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data bulk update tidak valid.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const updatedCount = await bulkUpdateProductPublicationStatus(parsed.data);

  return NextResponse.json({ updatedCount });
}
