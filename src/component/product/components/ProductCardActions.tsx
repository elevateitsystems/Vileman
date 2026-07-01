// ProductCardActions.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";
import { Product } from "@/lib/products";
import { useRouter } from "next/navigation";

interface ProductCardActionsProps {
  product: Product;
  className?: string;
}

export function ProductCardActions({ product, className = "" }: ProductCardActionsProps) {
  const router = useRouter();
  const { addItem, setSingleOrderProduct } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, 1);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSingleOrderProduct(product);
    router.push("/checkout");
  };

  return (
    <div className={`mt-10 flex flex-col gap-3 border-t border-gray-100 pt-8 relative z-10 lg:flex-row lg:items-center lg:justify-between lg:gap-4 ${className}`}>
      {/* Order Button - Full width on mobile/tablet, flex-1 on desktop */}
      <button 
        onClick={handleOrder}
        className="w-full h-12 rounded-lg bg-[#2e4857] px-4 text-[13px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black active:scale-95 lg:flex-1 lg:px-10 lg:text-[14px]"
      >
        <span className="hidden xs:inline">Order Now</span>
        <span className="xs:hidden">Order</span>
      </button>
      
      {/* Add to Cart Button - Full width on mobile/tablet, flex-1 on desktop */}
      <button
        onClick={handleAddToCart}
        className={`w-full h-12 flex items-center justify-center gap-2 rounded-lg border-2 border-[#2e4857] px-4 text-[13px] font-bold uppercase tracking-widest transition-all active:scale-95 lg:flex-1 lg:px-10 lg:text-[14px] ${
          isAdded
            ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
            : "text-[#2e4857] hover:bg-[#2e4857] hover:text-white"
        }`}
      >
        {isAdded ? (
          <>
            <span>✓</span>
            <span>Added!</span>
          </>
        ) : (
          <>
            {/* Show different icon sizes based on screen */}
            <ShoppingCart size={16} className="flex-shrink-0 hidden sm:inline" />
            <ShoppingCart size={14} className="flex-shrink-0 sm:hidden" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}