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
        "inline-flex shrink-0 items-center justify-center",
        className,
      )}
    >
      <img
        src="/logo.svg"
        alt="Logo Syifa Konveksi"
        className={cn("h-full w-full object-contain", imgClassName)}
      />
    </span>
  );
}
