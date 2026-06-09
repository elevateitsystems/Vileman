"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import placeholderImg from "@/assets/placeholder.svg";
import { CartItem } from "@/hooks/useCartStore";

interface CartItemListProps {
  items: CartItem[];
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
}

export function CartItemList({
  items,
  updateQuantity,
  removeItem,
}: CartItemListProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="max-h-[590px] overflow-y-auto scrollbar-hide">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-100">
            <tr>
              <th className="p-8 text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Product Details
              </th>
              <th className="p-8 text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center">
                Quantity
              </th>
              <th className="p-8 text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr
                key={item.slug}
                className="group transition-colors hover:bg-gray-50/30"
              >
                <td className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      <CartItemImage src={item.image || placeholderImg} name={item.name} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[18px] font-bold text-black group-hover:text-[#2e4857] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[14px] text-gray-400 uppercase tracking-widest line-clamp-1">
                        {item.shortDescription}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="flex items-center gap-1.5 text-[12px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-11 w-32 items-center justify-between rounded-lg bg-gray-50 px-4 border border-gray-100">
                      <button
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-[16px] font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-[12px] text-gray-400">
                      {item.price.toFixed(2)} / ea
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <div className="text-[20px] font-bold text-black">
                    {(item.price * item.quantity).toFixed(2)}{" "}
                    <span className="text-[14px] font-normal text-gray-400">
                      EUR
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function CartItemImage({ src, name }: { src: any; name: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      src={imgSrc}
      alt={name}
      fill
      className="object-cover"
      onError={() => setImgSrc(placeholderImg)}
    />
  );
}
