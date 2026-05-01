export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  mediaUrls: string[];
  kodeProduksi: string;
  periodeProduksi: string;
  harga: number;
  stockStatus: "Ready" | "Preorder" | "Terbatas";
  material: string;
  sizes: string[];
  colors: string[];
  views: number;
};

export const products: Product[] = [
  {
    id: "gamis-safira-premium",
    name: "Gamis Safira Premium",
    category: "Gamis",
    description:
      "Gamis elegan dengan bahan toyobo premium, jahitan rapi, dan cutting longgar untuk kebutuhan seragam komunitas maupun acara keluarga.",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    mediaUrls: [],
    kodeProduksi: "GMS-0524-01",
    periodeProduksi: "05-2024",
    harga: 150000,
    stockStatus: "Ready",
    material: "Toyobo premium",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Sky Blue", "Navy", "Mauve"],
    views: 1240,
  },
  {
    id: "kemeja-pdh-eksekutif",
    name: "Kemeja PDH Eksekutif",
    category: "Seragam",
    description:
      "Kemeja PDH corporate dengan struktur kerah tegas, opsi bordir logo, dan bahan adem untuk pemakaian operasional harian.",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
    mediaUrls: [],
    kodeProduksi: "PDH-0624-03",
    periodeProduksi: "06-2024",
    harga: 120000,
    stockStatus: "Preorder",
    material: "Oxford cotton blend",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Putih", "Abu Slate", "Biru"],
    views: 985,
  },
  {
    id: "kaos-komunitas-combed",
    name: "Kaos Komunitas Combed 30s",
    category: "Kaos",
    description:
      "Kaos komunitas berbahan combed 30s yang ringan, cocok untuk event, gathering, dan merchandise organisasi.",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    mediaUrls: [],
    kodeProduksi: "KOS-0424-11",
    periodeProduksi: "04-2024",
    harga: 55000,
    stockStatus: "Ready",
    material: "Cotton combed 30s",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Putih", "Hitam", "Sage"],
    views: 1720,
  },
  {
    id: "seragam-sekolah-ceria",
    name: "Seragam Sekolah Ceria",
    category: "Seragam",
    description:
      "Paket seragam sekolah dengan bahan kuat, mudah disetrika, dan detail warna yang bisa disesuaikan dengan identitas lembaga.",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=80",
    mediaUrls: [],
    kodeProduksi: "SKL-0724-02",
    periodeProduksi: "07-2024",
    harga: 98000,
    stockStatus: "Terbatas",
    material: "Tropical drill",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Biru Muda", "Merah", "Hijau"],
    views: 760,
  },
  {
    id: "outer-linen-nadira",
    name: "Outer Linen Nadira",
    category: "Outer",
    description:
      "Outer linen ringan dengan siluet modern untuk layering harian. Cocok dipadukan dengan gamis, tunik, atau kemeja polos.",
    mediaType: "video",
    mediaUrl:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80",
    mediaUrls: [],
    kodeProduksi: "OTR-0824-07",
    periodeProduksi: "08-2024",
    harga: 135000,
    stockStatus: "Ready",
    material: "Linen rayon",
    sizes: ["All Size", "XL"],
    colors: ["Cream", "Denim", "Terracotta"],
    views: 642,
  },
  {
    id: "rompi-event-utility",
    name: "Rompi Event Utility",
    category: "Rompi",
    description:
      "Rompi lapangan untuk panitia dan event organizer, dilengkapi kantong fungsional dan area bordir nama instansi.",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
    mediaUrls: [],
    kodeProduksi: "RMP-0924-04",
    periodeProduksi: "09-2024",
    harga: 89000,
    stockStatus: "Preorder",
    material: "Canvas drill",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Navy", "Khaki", "Hitam"],
    views: 531,
  },
];

export const categories = ["Semua", ...Array.from(new Set(products.map((product) => product.category)))];

export function getProduct(id: string) {
  return products.find((product) => product.id === id) ?? products[0];
}
