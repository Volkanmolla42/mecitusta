"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RoutartLogo from "./RoutartLogo";
import { ArrowRight, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { useContactSettings } from "@/hooks/useContactSettings";
import { openAnalyticsPreferences } from "@/lib/analytics";
import AutomotiveStripe from "@/components/ui/AutomotiveStripe";
import ProblemCta from "@/components/ProblemCta";

const quickLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#videolar", label: "Videolar" },
  { href: "/parcalar", label: "Ürünler" },
  { href: "/tamirveservis", label: "Tamir & Servis" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Footer() {
  const {
    phoneNumber: phone,
    email,
    address,
    city,
    district,
    postalCode,
  } = useContactSettings();
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mapQuery =
    address || [district, city, postalCode].filter(Boolean).join(", ");
  const mapHref = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}`
    : "/iletisim";
  const isExternalMap = mapHref.startsWith("http");
  const locationLabel = city || (address ? "Atölyemiz" : "İletişim");

  const handleLogoClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current >= 5) {
      e.preventDefault();
      clickCountRef.current = 0;
      router.push("/admin");
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };

  return (
    <footer className="mt-auto w-full bg-dark-bg text-slate-300">
      <AutomotiveStripe size="sm" />
      <ProblemCta />

      <div className="container py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.1fr_1.5fr] lg:gap-8">
          <div className="min-w-0">
            <Link
              href="/"
              aria-label="Opel Beyin Uzmanı ana sayfa"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none"
              onClick={handleLogoClick}
            >
              <Image
                src="/images/logos/logo-mark.webp"
                alt=""
                width={680}
                height={680}
                className="h-12 w-12 shrink-0 object-contain"
              />
              <span className="min-w-0">
                <span className="block text-base font-extrabold leading-tight text-white sm:text-lg">
                  OPEL <span className="text-amber-400">BEYİN UZMANI</span>
                </span>
                <span className="mt-1.5 inline-flex rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">
                  Mecit Usta
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Opel araçlarının elektronik ve şanzıman ünitelerinde profesyonel
              tamir, kodlama ve kalibrasyon.
            </p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <Image
                src="/images/logos/logo-berat-white.webp"
                alt="Berat Elektronik"
                width={223}
                height={61}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">Hızlı Erişim</h2>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">İletişim</h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              {phone && (
                <li className="flex items-start gap-3">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="leading-6 text-slate-300 transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${email}`}
                    className="break-all leading-6 text-slate-300 transition-colors hover:text-white"
                  >
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                  <a
                    href={mapHref}
                    target={isExternalMap ? "_blank" : undefined}
                    rel={isExternalMap ? "noopener noreferrer" : undefined}
                    className="leading-6 text-slate-300 transition-colors hover:text-white"
                  >
                    {address}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <InstagramIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <a
                  href="https://www.instagram.com/opelbeyinuzmani.comm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-6 text-slate-300 transition-colors hover:text-white"
                >
                  <span className="sr-only">Instagram: </span>
                  @opelbeyinuzmani.comm
                </a>
              </li>
              {!phone && !email && !address && (
                <li>
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    İletişim bilgileri
                    <ChevronRight className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:border-l lg:border-white/10 lg:pl-8">
            <a
              href={mapHref}
              target={isExternalMap ? "_blank" : undefined}
              rel={isExternalMap ? "noopener noreferrer" : undefined}
              className="group flex min-h-[160px] flex-col justify-between rounded-xl bg-white p-4 text-slate-900 shadow-sm transition-colors hover:bg-amber-50"
            >
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Konum
                  </p>
                  <p className="text-sm font-semibold leading-snug text-slate-900">
                    {locationLabel}
                  </p>
                </div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:text-amber-700">
                Kurumumuzu Gör
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>

            <Link
              href="/iletisim"
              className="group relative min-h-[160px] overflow-hidden rounded-xl"
            >
              <Image
                src="/images/heroes/hero-rebrand.jpg"
                alt="Berat Elektronik atölyesi"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                Atölyemiz
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Opel Beyin Uzmanı. Tüm hakları saklıdır.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/gizlilik"
              className="transition-colors hover:text-amber-400"
            >
              KVKK ve gizlilik
            </Link>
            <button
              type="button"
              onClick={openAnalyticsPreferences}
              className="transition-colors hover:text-amber-400"
            >
              Çerez tercihleri
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span>Tasarım ve yazılım</span>
            <a
              href="https://www.volkanmolla.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-300 transition-colors hover:text-amber-400"
            >
              Volkan Molla
            </a>
            <span>&</span>
            <RoutartLogo variant="dark" showTagline={false} size="sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}
