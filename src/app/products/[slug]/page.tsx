import { getProductBySlug, allSlugs } from "@/lib/products";
import { notFound } from "next/navigation";
import { SectionHero } from "@/component/product/SectionHero";
import { ProductGrid } from "./components/ProductGrid";

export function generateStaticParams() {
  return allSlugs;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isSubcategoryPage = !!product.subcategory;
  const cards = product.subcategory ?? product.items;

  return (
    <div className="product-page flex min-h-screen flex-col bg-[#fcfcfc]">
      <SectionHero
        backgroundImage={product.heroImage}
        heading={product.heading}
        description={product.description}
        priceRange={product.priceRange}
      />

      {cards && (
        <ProductGrid
          slug={slug}
          items={cards}
          isSubcategoryPage={isSubcategoryPage}
        />
      )}
    </div>
  );
}
