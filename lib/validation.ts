import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().trim().min(3),
  category: z.string().trim().min(2).default("Katalog"),
  description: z.string().trim().min(10),
  mediaType: z.enum(["image", "video"]),
  mediaUrl: z.string().trim().url(),
  galleryUrls: z.array(z.string().trim().url()).default([]),
  kodeProduksi: z.string().trim().min(3),
  periodeProduksi: z.string().trim().regex(/^\d{2}-\d{4}$/),
  harga: z.coerce.number().int().positive(),
  stockStatus: z.enum(["Ready", "Preorder", "Terbatas"]).default("Ready"),
  material: z.string().trim().min(1).default("-"),
  sizes: z.array(z.string().trim().min(1)).default([]),
  colors: z.array(z.string().trim().min(1)).default([]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
