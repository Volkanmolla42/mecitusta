// Turkish-aware URL slug generator
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Local brand SVG icon map
export const LOCAL_BRAND_LOGOS: Record<string, string> = {
  renault: "/images/brands/renault.svg",
  volkswagen: "/images/brands/volkswagen.svg",
  vw: "/images/brands/volkswagen.svg",
  "mercedes-benz": "/images/brands/mercedes-benz.svg",
  mercedes: "/images/brands/mercedes-benz.svg",
  bmw: "/images/brands/bmw.svg",
  audi: "/images/brands/audi.svg",
  ford: "/images/brands/ford.svg",
  peugeot: "/images/brands/peugeot.svg",
  citroen: "/images/brands/citroen.svg",
  "citroën": "/images/brands/citroen.svg",
  fiat: "/images/brands/fiat.svg",
  opel: "/images/brands/opel.svg",
  seat: "/images/brands/seat.svg",
  skoda: "/images/brands/skoda.svg",
  "škoda": "/images/brands/skoda.svg",
  toyota: "/images/brands/toyota.svg",
  hyundai: "/images/brands/hyundai.svg",
  honda: "/images/brands/honda.svg",
  nissan: "/images/brands/nissan.svg",
  volvo: "/images/brands/volvo.svg",
  kia: "/images/brands/kia.svg",
  dacia: "/images/brands/dacia.svg",
  "alfa-romeo": "/images/brands/alfa-romeo.svg",
  alfaromeo: "/images/brands/alfa-romeo.svg",
  porsche: "/images/brands/porsche.svg",
  "land-rover": "/images/brands/land-rover.svg",
  landrover: "/images/brands/land-rover.svg",
  jaguar: "/images/brands/jaguar.svg",
  mitsubishi: "/images/brands/mitsubishi.svg",
  chevrolet: "/images/brands/chevrolet.svg",
  chevy: "/images/brands/chevrolet.svg",
  suzuki: "/images/brands/suzuki.svg",
  mini: "/images/brands/mini.svg",
  mazda: "/images/brands/mazda.svg",
  jeep: "/images/brands/jeep.svg",
  iveco: "/images/brands/iveco.svg",
  subaru: "/images/brands/subaru.svg",
  genel: "/images/brands/genel.svg",
  "genel-uyumlu": "/images/brands/genel.svg",
  evrensel: "/images/brands/genel.svg",
  universal: "/images/brands/genel.svg",
  "tum-araclar": "/images/brands/genel.svg",
  "tum-markalar": "/images/brands/genel.svg",
  "coklu-uyumlu": "/images/brands/genel.svg",
  diger: "/images/brands/genel.svg",
};

// Local codebase category WebP images map
export const LOCAL_CATEGORY_IMAGES: Record<string, string> = {
  "motor-beyinleri-ecu": "/images/categories/cat-ecu.webp",
  ecu: "/images/categories/cat-ecu.webp",
  "motor-beyni": "/images/categories/cat-ecu.webp",
  "abs-esp-beyinleri": "/images/categories/cat-abs.webp",
  abs: "/images/categories/cat-abs.webp",
  esp: "/images/categories/cat-abs.webp",
  "airbag-beyinleri": "/images/categories/cat-airbag.webp",
  airbag: "/images/categories/cat-airbag.webp",
  srs: "/images/categories/cat-airbag.webp",
  "bcm-bsi-sam-modulleri": "/images/categories/cat-bcm.webp",
  bcm: "/images/categories/cat-bcm.webp",
  bsi: "/images/categories/cat-bcm.webp",
  "uch-sam-modulleri": "/images/categories/cat-uch.webp",
  uch: "/images/categories/cat-uch.webp",
  sam: "/images/categories/cat-uch.webp",
  "sigorta-kutulari": "/images/categories/cat-fusebox.webp",
  sigorta: "/images/categories/cat-fusebox.webp",
  fusebox: "/images/categories/cat-fusebox.webp",
  "gosterge-panelleri": "/images/categories/cat-cluster.webp",
  gosterge: "/images/categories/cat-cluster.webp",
  kadran: "/images/categories/cat-cluster.webp",
  cluster: "/images/categories/cat-cluster.webp",
  "direksiyon-kumanda-modulleri": "/images/categories/cat-steering.webp",
  "direksiyon-kolon-pompa": "/images/categories/cat-steering-pump.webp",
  "klima-kontrol-uniteleri": "/images/categories/cat-climate.webp",
  klima: "/images/categories/cat-climate.webp",
  "multimedya-uniteleri": "/images/categories/cat-multimedia.webp",
  multimedya: "/images/categories/cat-multimedia.webp",
  navigasyon: "/images/categories/cat-multimedia.webp",
  "konfor-modulleri": "/images/categories/cat-comfort.webp",
  "sanziman-beyinleri": "/images/categories/cat-transmission.webp",
  sanziman: "/images/categories/cat-transmission.webp",
  mekatronik: "/images/categories/cat-transmission.webp",
  "ecu-setleri": "/images/categories/cat-ecu-kit.webp",
  "cam-motorlari": "/images/categories/cat-window-motor.webp",
  "kumanda-panel-ve-dugmeler": "/images/categories/cat-switches.webp",
  "diger-elektronik-parcalar": "/images/categories/cat-electronics.webp",
};

// Subtle audio chime for new incoming chat message
export function playAdminNotificationSound() {
  try {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextConstructor) return;

    const ctx = new AudioContextConstructor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Ignore restricted audio
  }
}
