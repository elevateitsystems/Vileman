"use client";

import { ArrowLeft } from "lucide-react";

interface CartSummaryProps {
  totalPrice: number;
}

export function CartSummary({ totalPrice }: CartSummaryProps) {
  return (
    <div className="rounded-[24px] bg-white p-10 text-black shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100">
      <h2 className="mb-8 text-[24px] font-bold tracking-tight">Order Summary</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-6">
          <span className="text-gray-500 font-light">Subtotal</span>
          <span className="text-[18px] font-bold">{totalPrice.toFixed(2)} EUR</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-100 pb-6">
          <span className="text-gray-500 font-light">Estimated Shipping</span>
          <span className="text-[14px] font-bold uppercase tracking-widest text-[#3ed2a7]">Free</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="text-[18px] font-medium">Grand Total</span>
          <div className="text-right">
            <div className="text-[32px] font-bold leading-none">{totalPrice.toFixed(2)}</div>
            <span className="text-[14px] font-light text-gray-400 uppercase tracking-widest">EUR</span>
          </div>
        </div>
      </div>

      <button className="group mt-12 relative flex h-16 w-full items-center justify-center overflow-hidden rounded-full bg-[#2e4857] text-[16px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black">
        <span className="relative z-10 flex items-center gap-3">
          Secure Checkout
          <ArrowLeft size={18} className="rotate-180 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
      
      <div className="mt-8 flex items-center justify-center gap-4 text-gray-200">
        <div className="h-px flex-1 bg-gray-100"></div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Guaranteed Safe</span>
        <div className="h-px flex-1 bg-gray-100"></div>
      </div>
      
      <p className="mt-6 text-center text-[13px] font-light text-gray-400 leading-relaxed">
        Payments are processed securely via encrypted channels. We accept all major credit cards.
      </p>
    </div>
  );
}
