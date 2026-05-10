"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export function EmptyCategory() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-150 blur-3xl opacity-20 bg-[#2e4857] rounded-full" />
        <div className="relative size-24 flex items-center justify-center ">
           <ShoppingBag size={48} className="text-[#2e4857] opacity-20" />
        </div>
      </div>
      
      <h2 className="text-[32px] font-bold text-[#181b31] mb-4">
        No Products Found
      </h2>
      
      <p className="text-[18px] text-gray-400 max-w-md mx-auto mb-10 leading-relaxed font-light">
        We couldn&apos;t find any products in this category at the moment. 
        Please check back later or explore our other collections.
      </p>
      
      <Link 
        href="/"
        className="group flex items-center gap-3 bg-[#2e4857] text-white px-8 py-3 rounded font-bold transition-all hover:bg-[#2e4857] hover:shadow active:scale-95"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>
    </div>
  );
}
