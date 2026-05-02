export type ProductInquiryMessageInput = {
  name: string;
  kodeProduksi: string;
  harga: string;
  url: string;
};

export const DEFAULT_WHATSAPP_NUMBER = "+62 852-4176-7460";

export function getBusinessWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || DEFAULT_WHATSAPP_NUMBER;
}

export function normalizeWhatsAppNumber(phoneNumber?: string | null) {
  const digits = phoneNumber?.replace(/\D/g, "") ?? "";

  if (!digits) {
    return null;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export function buildProductInquiryMessage({
  name,
  kodeProduksi,
  harga,
  url,
}: ProductInquiryMessageInput) {
  return [
    "Halo Syifa Konveksi, saya mau tanya produk:",
    `Nama: ${name}`,
    `Kode produksi: ${kodeProduksi}`,
    `Harga: ${harga}`,
    `Link produk: ${url}`,
  ].join("\n");
}

export function buildGeneralContactMessage() {
  return "Halo Syifa Konveksi, saya mau konsultasi produk konveksi.";
}

export function buildWhatsAppUrl({
  phoneNumber,
  message,
}: {
  phoneNumber?: string | null;
  message: string;
}) {
  const normalizedNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedNumber) {
    return null;
  }

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
