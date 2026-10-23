import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import FaultCodesClient from "./FaultCodesClient";

export const metadata: Metadata = {
  title: "Opel OBD Arıza Kodları ve Anlamları",
  description:
    "Opel ve uyumlu araçların motor, şanzıman, ABS ve airbag OBD-II arıza kodlarını öğrenin. P, C, B, U kodlarının anlamları, olası nedenleri ve çözüm yolları.",
  openGraph: {
    title: "Opel OBD Arıza Kodları ve Anlamları | Mecit Usta",
    description:
      "Opel ve uyumlu araçların OBD-II arıza kodlarını öğrenin, anlamlarını keşfedin, doğru çözüme ulaşın.",
    images: ["/images/obd/obd-scanner-hero.jpg"],
  },
};

async function getFaultCodes() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  return await new ConvexHttpClient(convexUrl).query(api.faultCodes.listPublic, {});
}

export default async function FaultCodesPage() {
  const codes = await getFaultCodes();
  return <FaultCodesClient codes={codes} />;
}
