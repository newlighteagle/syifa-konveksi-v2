import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildGeneralContactMessage,
  buildWhatsAppUrl,
  getBusinessWhatsAppNumber,
} from "@/lib/whatsapp";

export function BusinessContactSection() {
  const phoneNumber = getBusinessWhatsAppNumber();
  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber,
    message: buildGeneralContactMessage(),
  });

  return (
    <section id="kontak" className="border-t border-slate-100 bg-white">
      <div className="container grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <Badge className="mb-4">Kontak Syifa Konveksi</Badge>
          <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
            Butuh produksi seragam, baju komunitas, atau katalog custom?
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Hubungi tim Syifa Konveksi untuk konsultasi model, bahan, ukuran, dan estimasi
            produksi. Kami siap bantu dari kebutuhan satuan sampai pesanan komunitas.
          </p>
        </div>

        <div className="grid gap-3">
          <ContactItem icon={<Phone />} label="WhatsApp" value={phoneNumber} />
          <ContactItem icon={<MapPin />} label="Area layanan" value="Indonesia, pengiriman menyesuaikan pesanan" />
          <ContactItem icon={<Clock />} label="Jam operasional" value="Senin-Sabtu, 08.00-17.00 WIB" />
          {whatsappUrl ? (
            <Button asChild className="mt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                Konsultasi via WhatsApp
              </a>
            </Button>
          ) : (
            <Button className="mt-2" disabled title="Nomor WhatsApp belum diset">
              <MessageCircle />
              WhatsApp belum diset
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <span className="mt-0.5 text-sky-700 [&_svg]:size-5">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-950">{value}</p>
      </div>
    </div>
  );
}
