"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { useEffect, useState } from "react";

export function CartBadge() {
  const { getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <Link href="/cart" className="relative group">
      <div className="p-2 transition-colors hover:text-brand-secondary">
        <ShoppingBag size={24} strokeWidth={1.5} />
      </div>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-[#2e4857] text-[10px] font-bold text-white shadow-sm transition-transform group-hover:scale-110">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
