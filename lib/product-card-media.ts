export type ProductCardMediaInput = {
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string | null;
};

export type ProductCardMediaSource =
  | {
      kind: "image";
      source: "thumbnail" | "primary-image";
      url: string;
    }
  | {
      kind: "placeholder";
      source: "video" | "unknown";
      url: string;
    };

export function getProductCardMediaSource({
  mediaType,
  mediaUrl,
  thumbnailUrl,
}: ProductCardMediaInput): ProductCardMediaSource {
  const normalizedThumbnailUrl = thumbnailUrl?.trim();

  if (normalizedThumbnailUrl) {
    return {
      kind: "image",
      source: "thumbnail",
      url: normalizedThumbnailUrl,
    };
  }

  if (mediaType === "image") {
    return {
      kind: "image",
      source: "primary-image",
      url: mediaUrl,
    };
  }

  return {
    kind: "placeholder",
    source: mediaType === "video" ? "video" : "unknown",
    url: mediaUrl,
  };
}
