import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OpelHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-800 bg-dark-bg text-white">
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <Image
          src="/images/hero-opel-beyin-v3.webp"
          alt="Opel beyin, Easytronic ve Magneti Marelli üniteleri"
          fill
          preload
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/95 via-dark-bg/90 to-dark-bg/55 sm:from-dark-bg/95 sm:via-dark-bg/70 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/25 to-transparent sm:from-dark-bg/70 sm:via-transparent" />
      </div>

      <div className="container relative z-10 flex min-h-[560px] items-center py-16 sm:min-h-[620px] sm:py-20 lg:min-h-[680px]">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">OPEL BEYİN VE</span>
            <span className="block text-amber-500">ŞANZIMAN TAMİRİ</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            Opel beyin, ECU ve şanzıman ünitelerinde arıza tespiti, tamir,
            kodlama ve kalibrasyon yapıyoruz.
          </p>

          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-lg px-6 text-sm shadow-none sm:px-7 sm:text-base"
            >
              <Link href="/tamirveservis">
                Detayları Gör
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
