import { getProductBySlug, categories } from "@/lib/products";
import { FileText, Maximize, Printer, Truck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

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
      {/* Hero Section */}
      <section
        className="product-hero product-hero-wave relative flex min-h-[400px] items-center overflow-hidden bg-cover bg-center px-4 pb-[140px] pt-[120px]"
        style={{ backgroundImage: `url(${category.heroImage})` }}
      >
        <div className="container  max-w-6xl px-4 md:px-0 relative z-10 mx-auto">
          <div className="max-w-3xl">
            <h1 className="portfolio-heading text-[42px] font-bold uppercase leading-none text-white md:text-[60px]">
              {category.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 md:px-0 pb-24 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(category.items || []).map((item, idx) => (
              <div key={idx} className="">
                <div className="relative w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-auto block"
                    priority={idx < 6}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Order Card */}
          <aside className="h-fit sticky top-24 rounded-[20px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] md:p-10">
            <div className="mb-10 flex items-start justify-between gap-4">
              <h3 className="text-[18px] font-medium text-gray-400">
                {product.name}
              </h3>
              <strong className="text-[32px] font-bold text-black">
                {product.price.toFixed(2)} EUR
              </strong>
            </div>

            <p className="my-5 text-[18px] font-light leading-relaxed text-[#797b86] md:text-[21px]">
              {product?.description}
            </p>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              <Info
                icon={<Maximize />}
                label="DIMENSIONS"
                value={product.dimensions}
              />
              <Info icon={<Printer />} label="PRINT" value={product.print} />
              <Info icon={<FileText />} label="PAPER" value={product.paper} />
              <Info
                icon={<Truck />}
                label="DELIVERY"
                value={product.delivery}
              />
            </div>

            <button className="mt-14 h-14 w-full rounded-full bg-[#2e4857] text-[16px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black">
              ORDER
            </button>
          </aside>
        </div>

        {/* Description Section at bottom */}
        <div className="mt-24 max-w-4xl">
          <h2 className="text-[44px] font-bold leading-tight text-black">
            {product.name}
          </h2>
          <p className="mt-8 text-[18px] font-light leading-relaxed text-[#797b86] md:text-[21px]">
            {product.description}
          </p>
        </div>
      </section>
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
