import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Opel ve Uyumlu Araç Markaları",
  description:
    "Opel ve uyumlu markalar için oto elektronik parça ve kontrol ünitelerini inceleyin.",
  path: "/markalar",
});

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
