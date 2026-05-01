import { NextResponse } from "next/server";

import { listCategoryOptions } from "@/lib/product-service";

export async function GET() {
  const categories = await listCategoryOptions();
  return NextResponse.json({ categories });
}
