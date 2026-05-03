import { NextResponse } from "next/server";

import { incrementProductViews } from "@/lib/product-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await incrementProductViews(slug);

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
