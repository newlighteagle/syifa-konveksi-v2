import { NextResponse } from "next/server";

import { listColorOptions } from "@/lib/product-service";

export async function GET() {
  const colors = await listColorOptions();
  return NextResponse.json({ colors });
}
