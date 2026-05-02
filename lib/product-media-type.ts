export type ProductMediaType = "image" | "video";

export const DEFAULT_PRODUCT_MEDIA_TYPE: ProductMediaType = "image";

export function getMediaUrlPlaceholder(mediaType: ProductMediaType) {
  return mediaType === "image"
    ? "https://example.com/foto-produk.jpg"
    : "https://www.youtube.com/shorts/T9X5KVfryAY";
}

export function getMediaUrlHelpText(mediaType: ProductMediaType) {
  return mediaType === "image"
    ? "Tempel URL gambar langsung seperti JPG, PNG, WebP, AVIF, atau GIF."
    : "Tempel link YouTube Shorts, Instagram Reel, atau link video langsung.";
}

export function getPreviewMediaType(index: number, mediaType: ProductMediaType) {
  return index === 0 ? mediaType : "image";
}
