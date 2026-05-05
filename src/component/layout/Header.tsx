"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";

import { categories } from "@/lib/products";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter to show top-level categories and handle subcategories
  const mainCategories = categories.filter(
    (cat) => !cat.slug.startsWith("cloth-") || cat.slug === "cloth-menu",
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-[74px] items-center justify-start gap-12">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/img/build/logo1.png"
                alt="Marta's Dekoviertel"
                width={120}
                height={50}
                className="w-[120px] h-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
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
                  {mainCategories.map((cat) => (
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

          {/* Right Actions */}
          <div className="flex-1 flex items-center justify-end gap-5">
            <Link
              href="/login"
              className="hidden sm:block text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
            >
              Login
            </Link>

            <button className="relative p-2 text-black hover:text-[#735c92] transition-colors">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#fe688b] text-[10px] font-bold text-white">
                0
              </span>
            </button>

            {/* Mobile Trigger */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-50 bg-white p-6 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-5">
            <Link
              href="/"
              className="text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Home page
            </Link>
            <div className="text-lg font-semibold text-gray-400">
              Our products
            </div>
            <div className="pl-4 flex flex-col gap-4 border-l-2 border-gray-100">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className="text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/contact-us"
              className="text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </Link>
            <div className="h-px bg-gray-100 my-2" />
            <Link
              href="/login"
              className="text-lg font-semibold text-brand-secondary"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
