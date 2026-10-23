import type { Metadata } from "next";
import {
  ArrowRight,
  Car,
  Check,
  Clock,
  Cog,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import HeroBanner from "@/components/ui/HeroBanner";
import FeatureCardGrid from "@/components/FeatureCardGrid";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { formatPhoneNumber, getWhatsAppUrl } from "@/lib/whatsapp";
import { createPageMetadata, serializeJsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";
import { getSiteContactSettings } from "@/lib/services-data";

export const metadata: Metadata = createPageMetadata({
  title: "İletişim & Servis",
  description:
    "Opel beyin, Easytronic ve Magneti Marelli şanzıman ünitelerinde arıza tespiti, tamir ve kodlama için Mecit Usta ile iletişime geçin.",
  path: "/iletisim",
});

const values = [
  {
    icon: Cog,
    title: "Deneyim",
    description: "Uzman kadro ile profesyonel hizmet.",
  },
  {
    icon: Car,
    title: "Teknoloji",
    description: "Güncel ekipman ve yazılımlar.",
  },
  {
    icon: ShieldCheck,
    title: "Doğruluk",
    description: "Doğru tespit, kalıcı çözüm.",
  },
  {
    icon: HeartHandshake,
    title: "Müşteri Memnuniyeti",
    description: "Memnuniyet odaklı, güler yüzlü hizmet.",
  },
];

const reasons = [
  "Opel araçlarda uzmanlaşmış kadro",
  "Easytronic ve Magneti Marelli şanzıman ünitesi tamiri",
  "ECU, BSI, modül ve tüm elektronik ünitelerde profesyonel onarım",
  "Gelişmiş arıza tespit ve test cihazları",
  "Garantili tamir ve kontrollü süreç",
  "Müşteri memnuniyeti odaklı hizmet",
];

export default async function IletisimPage() {
  const contact = await getSiteContactSettings();

  const displayPhone = contact.phoneNumber;
  const displayEmail = contact.email;
  const fullAddress = [contact.address, contact.district, contact.city]
    .filter(Boolean)
    .join(", ");
  const mapQuery = encodeURIComponent(fullAddress);

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: SITE_NAME,
    url: `${SITE_URL}/iletisim`,
    image: new URL("/images/logos/logo-mark.webp", SITE_URL).toString(),
    telephone: displayPhone,
    email: displayEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      ...(contact.district ? { addressLocality: contact.district } : {}),
      ...(contact.city ? { addressRegion: contact.city } : {}),
      ...(contact.postalCode ? { postalCode: contact.postalCode } : {}),
      addressCountry: "TR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(contactJsonLd) }}
      />

      <HeroBanner
        src="/images/heroes/contact-hero.webp"
        alt="Mecit Usta atölyesinde Opel araç"
        eyebrow="Hakkımızda"
        title="Güvenilir Tamir, Doğru Çözüm."
        description="Opel Beyin Uzmanı olarak otomotiv elektronik beyin ve şanzıman sistemlerinde uzmanlaşmış ekibimizle; arıza tespiti, tamir, kodlama ve test süreçlerini tek çatı altında yürütüyoruz. Gelişmiş ekipmanlarımızla doğru ve kalıcı çözümler üretiyoruz."
      />

      <section aria-label="Bizi tercih etme nedenleri" className="bg-white py-10 sm:py-12">
        <div className="container">
          <h2 className="sr-only">Bizi tercih etme nedenleri</h2>
          <FeatureCardGrid items={values} columns={4} />
        </div>
      </section>

      <section id="iletisim" className="bg-slate-50 py-14 sm:py-20">
        <div className="container grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-5">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Neden Biz?
            </h2>
            <ul className="mt-6 space-y-3.5">
              {reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              İletişim
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <a
                    href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
                    className="text-sm font-medium text-slate-900 transition-colors hover:text-amber-700"
                    aria-label={`Bizi telefonla arayın: ${formatPhoneNumber(displayPhone)}`}
                  >
                    {formatPhoneNumber(displayPhone)}
                  </a>
                  <a
                    href={getWhatsAppUrl(
                      {
                        message:
                          "Merhaba Mecit Usta, servis ve tamir hakkında bilgi almak istiyorum.",
                      },
                      displayPhone
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp'tan yazın"
                    title="WhatsApp'tan yazın"
                    className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${displayEmail}`}
                    className="break-all text-sm font-medium text-slate-900 transition-colors hover:text-amber-700"
                  >
                    {displayEmail}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="pt-2 text-sm font-medium leading-relaxed text-slate-900">
                    {contact.address}
                  </p>
                </div>

                {contact.workingHours && (
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="pt-0.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Çalışma Saatleri
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-900">
                        {contact.workingHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <iframe
                  title="İşletme konumu haritası"
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={`https://maps.google.com/maps?q=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-10 right-3 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-md ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
                >
                  Konumumuzu Gör
                  <ArrowRight className="h-4 w-4 text-amber-600" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
