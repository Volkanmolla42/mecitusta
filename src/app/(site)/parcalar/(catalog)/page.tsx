import { Suspense } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import ProductCatalogClient from "@/app/(site)/parcalar/ProductCatalogClient";
import { CatalogSkeleton } from "@/components/RouteSkeletons";


type ParcalarPageProps = {
  searchParams: Promise<{
    kategori?: string;
    marka?: string;
    model?: string;
    q?: string;
    durum?: string;
    stok?: string;
  }>;
};

export async function generateMetadata({ searchParams }: ParcalarPageProps): Promise<Metadata> {
  const params = await searchParams;
  const { kategori, marka, model, q, durum, stok } = params;
  const hasCatalogQuery = Boolean(kategori || marka || model || q || durum || stok);

  let title = "Opel Beyin ve Elektronik Parça Kataloğu";
  let description = "Opel araçları için ECU, ABS, airbag, BCM ve elektronik parça kataloğu.";

  if (q) {
    title = `"${q}" Parça Arama Sonuçları`;
    description = `"${q}" kodlu veya isimli parçaya uygun Opel uyumlu parça sonuçları ve stok durumu.`;
  } else if (kategori && marka) {
    title = `${marka} ${kategori} Parçaları`;
    description = `${marka} marka araçlar için ${kategori} kontrol üniteleri ve elektronik modülleri.`;
  } else if (kategori) {
    title = `${kategori} Modülleri`;
    description = `${kategori} kategorisindeki Opel uyumlu elektronik kontrol üniteleri ve yedek parçalar.`;
  } else if (marka) {
    title = `${marka} Oto Elektronik Parçaları`;
    description = `${marka} uyumlu oto beyinleri, modülleri ve elektronik parçaları.`;
  } else if (model) {
    title = `${model} Uyumlu Parçalar`;
    description = `${model} araç modeliyle eşleşen Opel uyumlu elektronik parçaları.`;
  }

  const metadata = createPageMetadata({
    title,
    description,
    path: "/parcalar",
  });

  return hasCatalogQuery
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata;
}

export default function ParcalarPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductCatalogClient />
    </Suspense>
  );
}
