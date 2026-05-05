"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCardActions } from "./ProductCardActions";
import { Product } from "@/lib/products";

interface ProductCardHorizontalProps {
  product: Product;
  href: string;
}

export function ProductCardHorizontal({ product, href }: ProductCardHorizontalProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden sm:flex-row gap-12 rounded-xl bg-white transition-all">
      <Link href={href} className="relative overflow-hidden md:flex-1 rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={800}
          className="object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <Link href={href} className="block space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-[28px] font-bold leading-tight text-black md:text-[34px] group-hover:text-[#2e4857] transition-colors">
              {product.name}
            </h3>
            <div className="text-[28px] font-bold text-black md:text-[34px]">
              {product.price.toFixed(2)}{" "}
              <span className="text-[20px] font-normal uppercase">EUR</span>
            </div>
          </div>

          {product.color && (
            <p className="text-[14px] font-bold uppercase tracking-widest text-gray-400">
              VARIANT: <span className="text-brand-secondary">{product.color}</span>
            </p>
          )}

          <p className="text-[18px] font-light leading-relaxed text-[#797b86] md:text-[20px]">
            {product.shortDescription || product.description}
          </p>

          {(product.dimensions || product.print || product.paper || product.delivery) && (
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
              {product.dimensions && <InfoItem label="Dimensions" value={product.dimensions} />}
              {product.print && <InfoItem label="Print" value={product.print} />}
              {product.paper && <InfoItem label="Paper" value={product.paper} />}
              {product.delivery && <InfoItem label="Delivery" value={product.delivery} />}
            </div>
          )}
        </Link>

        <ProductCardActions product={product} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="text-[16px] font-medium text-black">{value}</div>
    </div>
  );
}
