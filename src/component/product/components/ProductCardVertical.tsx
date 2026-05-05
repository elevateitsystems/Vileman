"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";
import { Product } from "@/lib/products";

interface ProductCardVerticalProps {
  product: Product;
  href: string;
}

export function ProductCardVertical({ product, href }: ProductCardVerticalProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, 1);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fancy-box-classes group relative flex flex-col overflow-hidden rounded-[15px] bg-white shadow-[0_30px_50px_rgba(0,0,0,0.05)] transition-shadow duration-[450ms] ease-[cubic-bezier(0.32,0.98,0.37,1)] hover:shadow-[0_30px_50px_rgba(0,0,0,0.07)]">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={800}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
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
        <button
          onClick={handleAddToCart}
          className={`flex w-full h-12 items-center justify-center gap-2 rounded-full border-2 border-[#2e4857] px-6 text-[14px] font-bold uppercase tracking-widest transition-all ${
            isAdded
              ? "bg-green-500 border-green-500 text-white"
              : "text-[#2e4857] hover:bg-[#2e4857] hover:text-white"
          }`}
        >
          {isAdded ? (
            "Added!"
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
