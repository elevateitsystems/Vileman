// featuredProduct.tsx
"use client";

import ProductBox from "@/component/product/ProductBox";

interface FeaturedProduct {
  id: string;
  href: string;
  imageSrc: string;
  name: string;
  price: number;
  description: string;
  slug: string;
  isCustomizable: boolean;
}

interface FeaturedProductsProps {
  products: FeaturedProduct[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section id="nasi_proizvodi" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-[30px] font-bold text-black uppercase tracking-widest mb-4">
            Termekek
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <ProductBox key={index} {...product} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
