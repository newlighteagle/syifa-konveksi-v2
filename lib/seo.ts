import { isDirectImageUrl } from "@/lib/media";
import type { Product } from "@/lib/products";
import { getBusinessWhatsAppNumber, normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const SITE_URL = "https://www.syifakonveksi.my.id";
export const SITE_NAME = "Syifa Konveksi";
export const SITE_DESCRIPTION =
  "Katalog digital Syifa Konveksi untuk melihat produk gamis, seragam, kaos, outer, dan rompi siap pesan.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export function getCanonicalUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function getProductSeoTitle(product: Product) {
  return `${product.name} | ${SITE_NAME}`;
}

export function getProductSeoDescription(product: Product) {
  return `${product.description} Kode produksi ${product.kodeProduksi}. Harga ${formatIdr(product.harga)}.`;
}

export function getProductOgImage(product: Product) {
  if (product.mediaType === "image" && isDirectImageUrl(product.mediaUrl)) {
    return product.mediaUrl;
  }

  return DEFAULT_OG_IMAGE;
}

export function buildOrganizationJsonLd() {
  const normalizedWhatsApp = normalizeWhatsAppNumber(getBusinessWhatsAppNumber());

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    telephone: getBusinessWhatsAppNumber(),
    contactPoint: normalizedWhatsApp
      ? [
          {
            "@type": "ContactPoint",
            telephone: `+${normalizedWhatsApp}`,
            contactType: "customer service",
            areaServed: "ID",
            availableLanguage: ["id"],
          },
        ]
      : undefined,
    sameAs: [],
  };
}

export function buildProductJsonLd(product: Product, productUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.kodeProduksi,
    category: product.category,
    image: getProductOgImage(product),
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IDR",
      price: product.harga,
      availability: getSchemaAvailability(product.stockStatus),
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function buildProductBreadcrumbJsonLd(product: Product, productUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produk",
        item: getCanonicalUrl("/#produk"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };
}

function getSchemaAvailability(stockStatus: Product["stockStatus"]) {
  if (stockStatus === "Preorder") {
    return "https://schema.org/PreOrder";
  }

  if (stockStatus === "Terbatas") {
    return "https://schema.org/LimitedAvailability";
  }

  return "https://schema.org/InStock";
}

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
