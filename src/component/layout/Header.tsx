"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { categories } from "@/lib/products";
import { DesktopNav } from "./components/DesktopNav";
import { MobileNav } from "./components/MobileNav";
import { CartBadge } from "./components/CartBadge";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter to show top-level categories and handle subcategories
  const mainCategories = categories.filter(
    (cat) => !cat.slug.startsWith("cloth-") || cat.slug === "cloth-menu"
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
                style={{ width: "120px", height: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <DesktopNav categories={mainCategories} />

          {/* Right Actions */}
          <div className="flex-1 flex items-center justify-end gap-5">
            <Link
              href="/admin"
              className="hidden sm:block text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/login"
              className="hidden sm:block text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
            >
              Login
            </Link>

            <CartBadge />

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
      <MobileNav 
        categories={categories} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </header>
  );
};

export default Header;
