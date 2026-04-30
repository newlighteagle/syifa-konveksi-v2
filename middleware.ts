import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "syifa_admin_session";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const loginUrl = new URL("/admin", request.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/products/:path*"],
};
