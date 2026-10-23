import type { Metadata } from "next";
import { getPublicBrands } from "@/lib/seo-data";
import { createPageMetadata } from "@/lib/seo";
import CatalogDirectoryPage from "@/components/CatalogDirectoryPage";


export const metadata: Metadata = createPageMetadata({
  title: "Opel ve Uyumlu Araç Markaları",
  description:
    "Opel ve uyumlu markalar için ECU, BCM ve elektronik kontrol ünitelerini inceleyin.",
  path: "/markalar",
});

export default async function MarkalarPage() {
  const brands = await getPublicBrands();

  return (
    <CatalogDirectoryPage
      title="Araç Markaları"
      badge="OPEL BEYİN UYUMLULUĞU"
      description="Opel ve uyumlu araç markaları için test edilmiş ECU ve elektronik modüller."
      heroImage="/images/heroes/brands-hero.jpg"
      actionLabel="Parçaları bul"
      detailLabel="Marka sayfası"
      items={brands.map((brand) => ({
        id: brand._id,
        title: `${brand.name} parçaları`,
        image: brand.logoUrl || null,
        filterHref: `/parcalar?marka=${encodeURIComponent(brand.name)}`,
        detailHref: `/markalar/${encodeURIComponent(brand.slug)}`,
      }))}
    />
  );
}
