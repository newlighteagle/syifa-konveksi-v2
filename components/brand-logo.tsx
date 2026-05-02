import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-1 shadow-soft",
        className,
      )}
    >
      <img
        src="/logo-center.png"
        alt="Logo Syifa Konveksi"
        className={cn("h-full w-full rounded-xl object-cover", imgClassName)}
      />
    </span>
  );
}
