"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Category } from "@/lib/products";

interface DesktopNavProps {
  categories: Category[];
}

export function DesktopNav({ categories }: DesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-7">
      <Link
        href="/"
        className="text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
      >
        Home page
      </Link>

      <div className="relative group">
        <button className="flex items-center gap-1 text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors">
          Our products <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {/* Megamenu/Dropdown */}
        <div className="absolute left-0 top-full pt-4 hidden group-hover:block">
          <div className="w-[232px] rounded-[5px] bg-white py-[1.0625em] text-left shadow-[0_16px_50px_rgba(0,0,0,0.07)]">
            {categories.map((cat) => (
              <div key={cat.slug} className="relative group/sub">
                {cat.subcategory ? (
                  <>
                    <button className="flex w-full items-center justify-between px-[2.5em] py-[0.7em] text-[16px] leading-normal text-[#797b86] hover:bg-[#e7eaee] hover:text-[#181b31]">
                      {cat.name}{" "}
                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-40" />
                    </button>
                    <div className="absolute left-full top-0 ml-1 pt-0 hidden group-hover/sub:block w-64">
                      <div className="w-[232px] rounded-[5px] bg-white py-[1.0625em] shadow-[0_16px_50px_rgba(0,0,0,0.07)]">
                        {cat.subcategory.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products/${sub.slug}`}
                            className="block px-[2.5em] py-[0.7em] text-[16px] leading-normal text-[#797b86] hover:bg-[#e7eaee] hover:text-[#181b31]"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={`/products/${cat.slug}`}
                    className="block px-[2.5em] py-[0.7em] text-[16px] leading-normal text-[#797b86] hover:bg-[#e7eaee] hover:text-[#181b31]"
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
