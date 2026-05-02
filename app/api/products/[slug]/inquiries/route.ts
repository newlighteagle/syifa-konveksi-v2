import { NextResponse } from "next/server";

import { incrementProductInquiries } from "@/lib/product-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const redirectUrl = getSafeRedirectUrl(new URL(request.url).searchParams.get("redirect"));

  await incrementProductInquiries(slug);

  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.json({ ok: true });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await incrementProductInquiries(slug);

  return NextResponse.json({ ok: true });
}

function getSafeRedirectUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.hostname === "wa.me" ? url : null;
  } catch {
    return null;
  }
}
