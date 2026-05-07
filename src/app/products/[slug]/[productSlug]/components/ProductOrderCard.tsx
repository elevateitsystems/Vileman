"use client";

import { ProductInfo } from "@/component/product/ProductInfo";
import { Product } from "@/lib/products";
import { FileText, Maximize, Printer, Truck, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";

import { useRouter } from "next/navigation";

interface ProductOrderCardProps {
  product: Product;
}

export function ProductOrderCard({ product }: ProductOrderCardProps) {
  const router = useRouter();
  const { addItem, setSingleOrderProduct } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleOrder = () => {
    setSingleOrderProduct(product);
    router.push("/checkout");
  };

  return (
    <aside className="h-fit sticky top-24 rounded-lg bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] md:p-10">
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
        <ProductInfo
          icon={<Maximize />}
          label="DIMENSIONS"
          value={product.dimensions}
        />
        <ProductInfo icon={<Printer />} label="PRINT" value={product.print} />
        <ProductInfo icon={<FileText />} label="PAPER" value={product.paper} />
        <ProductInfo
          icon={<Truck />}
          label="DELIVERY"
          value={product.delivery}
        />
      </div>

      <div className="mt-14 flex flex-col gap-4">
        <button 
          onClick={handleOrder}
          className="h-14 w-full rounded-lg bg-[#2e4857] text-[16px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black"
        >
          ORDER
        </button>
        <button
          onClick={handleAddToCart}
          className={`flex h-14 w-full items-center justify-center gap-3 rounded-lg border-2 border-[#2e4857] text-[16px] font-bold uppercase tracking-[0.2em] transition-all ${
            isAdded
              ? "bg-green-500 border-green-500 text-white"
              : "text-[#2e4857] hover:bg-[#2e4857] hover:text-white"
          }`}
        >
          {isAdded ? (
            "ADDED!"
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              ADD TO CART
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
