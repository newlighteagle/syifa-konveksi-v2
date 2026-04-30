import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-airy">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-sky-50">
          <Image
            src={product.mediaUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge>{product.category}</Badge>
            {product.mediaType === "video" ? (
              <Badge variant="secondary" className="gap-1">
                <PlayCircle className="size-3" />
                Video
              </Badge>
            ) : null}
          </div>
        </div>
      </Link>
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
          <Button asChild variant="secondary" size="sm">
            <Link href={`/products/${product.id}`}>
              Detail
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
