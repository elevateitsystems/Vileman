import ProductBox from "@/component/product/ProductBox";
import { getProductBySlug, products } from "@/lib/products";
import { FileText, Maximize, Printer, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
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

  const cards = product?.subcategory ?? product.items;

  return (
    <div className="product-page flex min-h-screen flex-col">
      <section
        className="product-hero product-hero-wave relative flex min-h-[430px] items-center overflow-hidden bg-cover bg-center px-4 pb-[170px] pt-[150px]"
        style={{ backgroundImage: `url(${product.heroImage})` }}
      >
        <div className="container max-w-4xl mx-auto px-4 md:px-0 relative z-10">
          <div className="max-w-3xl">
            <h1 className="portfolio-heading text-[42px] font-bold uppercase leading-none text-white md:text-[60px]">
              {product.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-[21px] font-light leading-relaxed text-white/90 md:text-[24px]">
              {product.description}
            </p>
            <strong className="mt-8 block text-[34px] leading-none text-white md:text-[42px]">
              {product.priceRange || "20.99"} EUR
            </strong>
          </div>
        </div>
      </section>

      {cards && (
        <section className="container max-w-4xl mx-auto px-4 md:px-0 pb-24 pt-8">
          <div className="grid grid-cols-1 gap-16">
            {cards.map((item) => (
              <ProductBox
                key={`${item.name}-${item.image}`}
                href={`/products/${slug}/${item.slug}`}
                imageSrc={item.image}
                name={item.name}
                price={item?.price}
                description={item.description}
                shortDescription={item.shortDescription}
                color={item.color}
                layout="horizontal"
                dimensions={item.dimensions}
                print={item.print}
                paper={item.paper}
                delivery={item.delivery}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f3f5f7] text-brand-secondary [&_svg]:size-6">
        {icon}
      </div>
      <div>
        <div className="text-[12px] font-bold uppercase tracking-wider text-[#a7a9b8]">
          {label}
        </div>
        <div className="text-[18px] font-medium text-black">{value}</div>
      </div>
    </div>
  );
}
