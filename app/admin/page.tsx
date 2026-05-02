import { AdminLoginForm } from "@/components/admin-login-form";
import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,#dff3ff_0%,transparent_35%),linear-gradient(180deg,#f7fbff,#f7f9fb)] p-6">
      <Card className="relative w-full max-w-md overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 sky-gradient" />
        <CardContent className="p-8 sm:p-10">
          <div className="text-center">
            <BrandLogo className="mx-auto size-20 rounded-2xl" />
            <h1 className="mt-6 text-2xl font-extrabold text-slate-950">Masuk Admin</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Akses aman untuk mengelola katalog Syifa Konveksi.
            </p>
          </div>

          <AdminLoginForm />
        </CardContent>
        <div className="border-t border-slate-100 bg-slate-50 px-8 py-4 text-center text-xs font-semibold text-slate-500">
          Secure Admin Access
        </div>
      </Card>
    </main>
  );
}
