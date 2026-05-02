import { MessageCircle } from "lucide-react";

import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsAppButton() {
  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    message: buildGeneralContactMessage(),
  });

  if (!whatsappUrl) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Syifa Konveksi via WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-bold text-white shadow-airy transition hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 sm:px-5"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
