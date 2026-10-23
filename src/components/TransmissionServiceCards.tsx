import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const transmissionCards = [
  {
    brand: "OPEL",
    title: "BEYİN TAMİRİ",
    accent: "bg-amber-500",
    image: "/images/cards/opel-beyin-card-v2.webp",
    mobileImage: "/images/cards/opel-beyin-card-mobile-v2.webp",
    alt: "Opel beyin / ECU ünitesi",
    featured: true,
    features: [
      "Arıza tespiti",
      "Beyin ve ECU onarımı",
      "Yazılım ve kodlama",
      "Test ve doğrulama",
    ],
  },
  {
    brand: "EASYTRONIC",
    title: "ŞANZIMAN ÜNİTESİ TAMİRİ",
    accent: "bg-amber-500",
    image: "/images/cards/easytronic-card.webp",
    mobileImage: "/images/cards/easytronic-card-mobile.webp",
    alt: "Easytronic şanzıman ünitesi",
    featured: false,
    features: [
      "Arıza tespiti",
      "Elektronik kart onarımı",
      "Mekanik kontrol",
      "Test ve kalibrasyon",
    ],
  },
  {
    brand: "MAGNETI MARELLI",
    title: "ŞANZIMAN ÜNİTESİ TAMİRİ",
    accent: "bg-red-600",
    image: "/images/cards/marelli-card.webp",
    mobileImage: "/images/cards/marelli-card-mobile.webp",
    alt: "Magneti Marelli şanzıman ünitesi",
    featured: false,
    features: [
      "Arıza tespiti",
      "Elektronik kart onarımı",
      "Yazılım güncelleme",
      "Test ve doğrulama",
    ],
  },
];

export default function TransmissionServiceCards() {
  return (
    <section className="container pt-14 sm:pt-20">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {transmissionCards.map((card) => (
          <article
            key={card.brand}
            className={`relative isolate min-h-[620px] overflow-hidden rounded-2xl border border-white/10 bg-dark-bg text-white md:flex md:min-h-[400px] ${card.featured ? "lg:col-span-2 lg:min-h-[480px]" : ""}`}
          >
            <div className="pointer-events-none absolute inset-0 select-none md:hidden">
              <Image
                src={card.mobileImage}
                alt={card.alt}
                fill
                sizes="100vw"
                className="object-cover object-[center_65%]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/90 via-dark-bg/60 to-transparent" />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden select-none md:block">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes={card.featured ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/55 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/55 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex w-full flex-col items-start p-6 sm:p-8 md:h-full md:justify-between">
              <div className="max-w-md">
                <span
                  className={`mb-4 block h-1 w-12 rounded-full ${card.accent}`}
                  aria-hidden="true"
                />
                <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {card.brand}
                </p>
                <h2 className="mt-2 max-w-[16rem] text-2xl font-extrabold leading-tight text-amber-500 sm:text-3xl">
                  <span className="sr-only">{card.brand} </span>
                  {card.title}
                </h2>

                <ul className="mt-5 space-y-2">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-200"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                variant="darkOutline"
                className="mt-6 w-fit rounded-lg border-amber-400/70 bg-black/30 px-5 py-2.5 text-sm font-semibold text-amber-400 shadow-none hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950"
              >
                <Link href="/tamirveservis">
                  Detayları Gör
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
