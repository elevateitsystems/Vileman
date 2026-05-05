"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHero } from "@/component/product/SectionHero";
import { EmptyCart } from "./components/EmptyCart";
import { CartItemList } from "./components/CartItemList";
import { CartSummary } from "./components/CartSummary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      <SectionHero 
        backgroundImage="/img/build/pics/misc/bgcl1.png"
        heading="Shopping Bag"
        description="Manage your selected items and proceed to checkout."
      />

      <div className="container mx-auto max-w-6xl px-4 md:px-0 pt-16">
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href="/products" 
            className="group inline-flex items-center gap-2 text-[16px] font-medium text-gray-400 hover:text-[#2e4857] transition-all"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            <span>Continue Shopping</span>
          </Link>
          <div className="text-gray-400">
            <span className="font-bold text-[#2e4857]">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'} in your bag
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <CartItemList 
              items={items} 
              updateQuantity={updateQuantity} 
              removeItem={removeItem} 
            />
          </div>

          <div className="lg:col-span-1">
            <CartSummary totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
