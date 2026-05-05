"use client";

import Link from "next/link";
import { Category } from "@/lib/products";

interface MobileNavProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ categories, isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-gray-50 bg-white p-6 shadow-xl animate-in slide-in-from-top duration-300">
      <nav className="flex flex-col gap-5">
        <Link
          href="/"
          className="text-lg font-semibold"
          onClick={onClose}
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
              onClick={onClose}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <Link
          href="/contact-us"
          className="text-lg font-semibold"
          onClick={onClose}
        >
          Contact us
        </Link>
        <div className="h-px bg-gray-100 my-2" />
        <Link
          href="/login"
          className="text-lg font-semibold text-brand-secondary"
          onClick={onClose}
        >
          Login
        </Link>
      </nav>
    </div>
  );
}
