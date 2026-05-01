import { ExternalLink, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getInstagramEmbedUrl, isDirectImageUrl, isDirectVideoUrl } from "@/lib/media";

type ProductMediaProps = {
  name: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  priority?: boolean;
};

export function ProductCardMedia({ name, mediaType, mediaUrl }: ProductMediaProps) {
  if (mediaType === "image" && isDirectImageUrl(mediaUrl)) {
    return (
      <img
        src={mediaUrl}
        alt={name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-white text-sky-700 shadow-airy">
        <PlayCircle className="size-8" />
      </span>
      <p className="mt-4 text-sm font-bold text-slate-950">
        {mediaType === "video" ? "Video produk" : "Media produk"}
      </p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{name}</p>
    </div>
  );
}

export function ProductDetailMedia({
  name,
  mediaType,
  mediaUrl,
  priority,
}: ProductMediaProps) {
  const instagramEmbedUrl = getInstagramEmbedUrl(mediaUrl);

  if (instagramEmbedUrl) {
    return (
      <iframe
        src={instagramEmbedUrl}
        title={`Media ${name}`}
        className="h-full w-full border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (mediaType === "video" && isDirectVideoUrl(mediaUrl)) {
    return (
      <video className="h-full w-full object-cover" controls playsInline>
        <source src={mediaUrl} />
      </video>
    );
  }

  if (mediaType === "video") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-white text-sky-700 shadow-airy">
          <PlayCircle className="size-10" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-950">Video produk tersedia</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Buka video asli untuk melihat detail produk dari sumber media.
        </p>
        <Button asChild className="mt-5">
          <a href={mediaUrl} target="_blank" rel="noreferrer">
            Buka Video
            <ExternalLink />
          </a>
        </Button>
      </div>
    );
  }

  if (isDirectImageUrl(mediaUrl) || mediaType === "image") {
    return (
      <img
        src={mediaUrl}
        alt={name}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return null;
}
