import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProblemCta() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-dark-bg text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full select-none md:w-[58%]">
        <Image
          src="/images/heroes/cta-opel-banner.webp"
          alt="Opel araç"
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/60 via-dark-bg/85 to-dark-bg md:from-dark-bg/20 md:via-dark-bg/75 md:to-dark-bg" />
      </div>

      <div className="container relative z-10 py-10 sm:py-12">
        <div className="md:ml-auto md:w-[55%] lg:w-[58%]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-xl text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
              <span className="block">Opel Araçlarınızın</span>
              <span className="block">Elektronik ve Şanzıman Ünitelerinde</span>
              <span className="block">Profesyonel Çözüm</span>
            </h2>
            <Button
              asChild
              size="lg"
              className="w-fit shrink-0 rounded-lg px-6 text-sm shadow-none sm:text-base"
            >
              <Link href="/iletisim">
                İletişim
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
