import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Opel Beyin ve Elektronik Parçalar",
  description:
    "Opel araçları için ECU, ABS, BCM, BSI ve diğer elektronik parçaları kategori, marka veya OEM numarasıyla bulun.",
  path: "/parcalar",
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
