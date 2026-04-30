import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,#dff3ff_0%,transparent_35%),linear-gradient(180deg,#f7fbff,#f7f9fb)] p-6">
      <Card className="relative w-full max-w-md overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 sky-gradient" />
        <CardContent className="p-8 sm:p-10">
          <div className="text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky-50 text-sky-700">
              <ShieldCheck className="size-8" />
            </span>
            <h1 className="mt-6 text-2xl font-extrabold text-slate-950">Masuk Admin</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Akses frontend demo untuk mengelola katalog Syifa Konveksi.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@syifakonveksi.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-xs font-semibold text-sky-700" href="#">
                  Lupa?
                </a>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input id="password" type="password" placeholder="Masukkan password" className="pl-10" />
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/dashboard">
                Masuk
                <ArrowRight />
              </Link>
            </Button>
          </form>
        </CardContent>
        <div className="border-t border-slate-100 bg-slate-50 px-8 py-4 text-center text-xs font-semibold text-slate-500">
          Secure Admin Access
        </div>
      </Card>
    </main>
  );
}
