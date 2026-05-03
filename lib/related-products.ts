import type { Product } from "@/lib/products";

export function getRelatedProducts({
  products,
  currentProduct,
  limit = 3,
}: {
  products: Product[];
  currentProduct: Product;
  limit?: number;
}) {
  return products
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        product.category === currentProduct.category &&
        product.publicationStatus === "published",
    )
    .slice(0, limit);
}
