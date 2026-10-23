import { createPageMetadata } from "@/lib/seo";
import { getPublicCategories } from "@/lib/seo-data";
import CatalogDirectoryPage from "@/components/CatalogDirectoryPage";


export const metadata = createPageMetadata({
  title: "Kategoriler",
  description: "Opel beyin ve elektronik parçalarını kategorilere göre inceleyin.",
  path: "/kategoriler",
});

export default async function CategoriesPage() {
  const categories = await getPublicCategories();

  return (
    <CatalogDirectoryPage
      title="Parça Kategorileri"
      badge="OPEL BEYİN KATALOĞU"
      description="Opel motor beyni, ABS, BCM, şanzıman ve elektronik modülleri kategorilere göre inceleyin."
      heroImage="/images/heroes/categories-hero.jpg"
      actionLabel="Parçaları bul"
      detailLabel="Kategori sayfası"
      items={categories.map((category) => ({
        id: category._id,
        title: category.name,
        image: category.image &&
          /^(?:data:image\/webp;)|\.webp(?:[?#]|$)/i.test(category.image)
          ? category.image
          : null,
        filterHref: `/parcalar?kategori=${encodeURIComponent(category.slug)}`,
        detailHref: `/kategoriler/${encodeURIComponent(category.slug)}`,
      }))}
    />
  );
}
