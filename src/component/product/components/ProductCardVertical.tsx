"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import { ProductCardActions } from "./ProductCardActions";

interface ProductCardVerticalProps {
  product: Product;
  href: string;
  priority?: boolean;
}

export function ProductCardVertical({
  product,
  href,
  priority = false,
}: ProductCardVerticalProps) {
  return (
    <div className="fancy-box-classes group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_30px_50px_rgba(0,0,0,0.05)] transition-shadow duration-[450ms] ease-[cubic-bezier(0.32,0.98,0.37,1)] hover:shadow-[0_30px_50px_rgba(0,0,0,0.07)]">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={800}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
        </div>
        <div className="p-[1.5em_25px] pb-4">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
            <h3 className="text-[24px] font-light leading-[1.15em] text-black transition-colors">
              {product.name}
            </h3>
            <div className="text-[24px] md:text-[28px] font-bold text-black whitespace-nowrap">
              {product.price.toFixed(2)}{" "}
              <span className="text-[18px] font-normal uppercase">EUR</span>
            </div>
          </div>
          <p className="text-[18px] md:text-[20px] text-brand-secondary font-light leading-[1.5em] group-hover:text-gray-500 line-clamp-2">
            {product.shortDescription || product.description}
          </p>
        </div>
      </Link>
      <div className="p-[0_25px_1.5em_25px] mt-auto">
        <ProductCardActions product={product} />
      </div>
    </div>
  );
}
