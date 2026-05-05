import { getProductBySlug, categories } from "@/lib/products";
import { notFound } from "next/navigation";
import { SectionHero } from "@/component/product/SectionHero";
import { ProductGallery } from "./components/ProductGallery";
import { ProductOrderCard } from "./components/ProductOrderCard";
import { ProductDescription } from "./components/ProductDescription";

export function generateStaticParams() {
  const params: { slug: string; productSlug: string }[] = [];

  categories.forEach((category) => {
    if (category.items) {
      category.items.forEach((item) => {
        params.push({
          slug: category.slug,
          productSlug: item.slug,
        });
      });
    }
  });

  return params;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const category = getProductBySlug(slug);

  if (!category || !category.items) {
    notFound();
  }

  const product = category.items.find((item) => item.slug === productSlug);

  if (!product) {
    notFound();
  }

  return (
    <div className="product-detail-page flex min-h-screen flex-col bg-[#fcfcfc]">
      <SectionHero backgroundImage={category.heroImage} heading={category.name} />

      <section className="container max-w-6xl mx-auto px-4 md:px-0 pb-24 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery items={category.items} />
          <ProductOrderCard product={product} />
        </div>

        <ProductDescription product={product} />
      </section>
    </div>
  );
}
