import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: "Email atau password tidak valid." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  let user: { id: string; email: string; name: string; passwordHash: string } | null = null;

  if (hasDatabaseUrl()) {
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.error("Falling back to demo admin login:", error);
    }
  }

  if (!user) {
    const fallbackEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@syifakonveksi.com";
    const fallbackPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

    if (email === fallbackEmail) {
      user = {
        id: "demo-admin",
        email: fallbackEmail,
        name: "Syifa Admin",
        passwordHash: await bcrypt.hash(fallbackPassword, 10),
      };
    }
  }

  const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isValid) {
    return NextResponse.json({ message: "Email atau password salah." }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}
