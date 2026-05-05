"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";
import { Product } from "@/lib/products";

interface ProductCardActionsProps {
  product: Product;
  className?: string;
}

export function ProductCardActions({ product, className = "" }: ProductCardActionsProps) {
  const { addItem, openOrderModal } = useCartStore();
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
    
    openOrderModal(product);
  };

  return (
    <div className={`mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-8 relative z-10 ${className}`}>
      <button 
        onClick={handleOrder}
        className="flex-1 w-full h-12 rounded-lg bg-[#2e4857] px-10 text-[14px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black"
      >
        Order
      </button>
      <button
        onClick={handleAddToCart}
        className={`flex-1 w-full sm:w-auto h-12 flex items-center justify-center gap-2 rounded-lg border-2 border-[#2e4857] px-8 text-[14px] font-bold uppercase tracking-widest transition-all ${
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
  );
}
