"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "@/lib/products";

interface DesktopNavProps {
  categories: Category[];
}

export function DesktopNav({ categories }: DesktopNavProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const closeDropdown = () => setIsProductsOpen(false);

  return (
    <nav className="hidden lg:flex items-center gap-7">
      <Link
        href="/"
        className="text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
      >
        Home page
      </Link>

      <div
        className="relative group"
        onMouseEnter={() => setIsProductsOpen(true)}
        onMouseLeave={() => setIsProductsOpen(false)}
      >
        <button className="flex items-center gap-1 text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors">
          Our products <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {/* Megamenu/Dropdown */}
        <div
          className={`absolute left-0 top-full pt-4 ${isProductsOpen ? "block" : "hidden"}`}
        >
          <div className="w-[232px] rounded-lg bg-white py-[1.0625em] text-left shadow-[0_16px_50px_rgba(0,0,0,0.07)] border border-gray-100">
            {categories.map((cat) => (
              <div key={cat.slug} className="relative group/sub">
                {cat.subcategory && cat.subcategory.length > 0 ? (
                  <>
                    <Link
                      href={`/products/${cat.slug}`}
                      className="flex w-full items-center justify-between px-[2.5em] py-[0.8em] text-[16px] leading-normal text-[#797b86] group-hover/sub:bg-[#f8f9fa] group-hover/sub:text-[#181b31] transition-all duration-200"
                      onClick={closeDropdown}
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-40 group-hover/sub:opacity-100 transition-opacity" />
                    </Link>
                    <div className="absolute left-full top-[-1px] ml-0 hidden group-hover/sub:block min-w-[280px] h-full">
                      <div className="rounded-r-lg bg-white py-[1.2em] shadow-[12px_16px_50px_rgba(0,0,0,0.1)] border border-gray-100 border-l-0 min-h-[200px]">
                        {cat.subcategory.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products/${sub.slug}`}
                            className="block px-[2.5em] py-[0.9em] text-[15px] leading-tight text-[#797b86] hover:bg-[#f3f4f6] hover:text-[#181b31] transition-colors"
                            onClick={closeDropdown}
                          >
                            <div className="font-medium whitespace-nowrap">{sub.name}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={`/products/${cat.slug}`}
                    className="block px-[2.5em] py-[0.8em] text-[16px] leading-normal text-[#797b86] hover:bg-[#e7eaee] hover:text-[#181b31] transition-colors"
                    onClick={closeDropdown}
                  >
                    {cat.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/contact-us"
        className="text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
      >
        Contact us
      </Link>
    </nav>
  );
}
