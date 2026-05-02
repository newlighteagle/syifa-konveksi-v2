import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().trim().min(3, "Nama produk minimal 3 karakter."),
  category: z.string().trim().min(2, "Kategori wajib dipilih.").default("Katalog"),
  description: z.string().trim().min(3, "Deskripsi minimal 3 karakter."),
  mediaType: z.enum(["image", "video"]),
  mediaUrl: z.string().trim().url("Link media utama harus berupa URL valid."),
  galleryUrls: z.array(z.string().trim().url("Setiap link galeri harus berupa URL valid.")).default([]),
  kodeProduksi: z.string().trim().min(3, "Kode produksi minimal 3 karakter."),
  periodeProduksi: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{4}$/, "Periode produksi wajib dipilih."),
  harga: z.coerce.number().int().positive("Harga harus lebih dari 0."),
  stockStatus: z.enum(["Ready", "Preorder", "Terbatas"]).default("Ready"),
  publicationStatus: z.enum(["draft", "published"]).default("published"),
  material: z.string().trim().min(1).default("-"),
  sizes: z.array(z.string().trim().min(1)).default([]),
  colors: z.array(z.string().trim().min(1)).default([]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const optionNameSchema = z.object({
  name: z.string().trim().min(1, "Nama opsi wajib diisi.").max(60, "Nama opsi maksimal 60 karakter."),
});

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
