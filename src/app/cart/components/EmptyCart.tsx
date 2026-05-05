"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { SectionHero } from "@/component/product/SectionHero";

export function EmptyCart() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <SectionHero 
        backgroundImage="/img/build/pics/misc/bgcl1.png"
        heading="Your Cart"
        description="Your shopping bag is currently empty."
      />
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mb-8 flex justify-center text-gray-200">
          <ShoppingBag size={120} strokeWidth={1} />
        </div>
        <h2 className="mb-6 text-[32px] font-bold text-black">Your bag is empty</h2>
        <p className="mb-10 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          href="/products" 
          className="inline-flex h-14 items-center justify-center rounded-lg bg-[#2e4857] px-10 text-[16px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
