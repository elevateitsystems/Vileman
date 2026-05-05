import { categories } from "@/lib/products";
import { SectionHero } from "@/component/product/SectionHero";
import { CategoryGrid } from "./components/CategoryGrid";

export default function ProductsPage() {
  // Filter out subcategories and keep main categories for the overview
  const mainCategories = categories.filter(
    (cat) => !cat.slug.startsWith("cloth-") || cat.slug === "cloth-menu"
  );

  return (
    <div className="products-overview-page flex min-h-screen flex-col bg-[#fcfcfc]">
      <SectionHero
        backgroundImage="/img/build/pics/misc/bgcl1.png"
        heading="Our Collections"
        description="Discover our wide range of premium kitchen linens, custom mugs, and unique gifts designed to add a personal touch to your home."
      />
      <CategoryGrid categories={mainCategories} />
    </div>
  );
}
