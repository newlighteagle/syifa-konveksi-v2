import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";

import { ProductCardMedia } from "@/components/product-media";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-airy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sky-50">
        <ProductCardMedia
          name={product.name}
          mediaType={product.mediaType}
          mediaUrl={product.mediaUrl}
          thumbnailUrl={product.thumbnailUrl}
        />
        <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
          <Badge>{product.category}</Badge>
          {product.mediaType === "video" ? (
            <Badge variant="secondary" className="gap-1">
              <PlayCircle className="size-3" />
              Video
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase text-sky-700">{product.kodeProduksi}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">Mulai dari</p>
            <p className="font-bold text-slate-950">{formatRupiah(product.harga)}</p>
          </div>
          <span className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 text-sm font-semibold text-sky-800 transition group-hover:bg-sky-100">
            Detail
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
