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
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-950 shadow-soft",
        className,
      )}
    >
      <img
        src="/logo-syifa-konveksi.svg"
        alt="Logo Syifa Konveksi"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </span>
  );
}
