"use client";

import Link from "next/link";
import { Category } from "@/lib/products";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

interface MobileNavProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ categories, isOpen, onClose }: MobileNavProps) {
  const { isAuthenticated, logout } = useAuth();
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
        {isAuthenticated ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-lg">
                {useAuth.getState().user?.firstName?.[0]}{useAuth.getState().user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{useAuth.getState().user?.displayName}</p>
                <p className="text-sm text-gray-500">{useAuth.getState().user?.email}</p>
              </div>
            </div>
            {useAuth.getState().user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-lg font-semibold text-gray-700"
                onClick={onClose}
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-lg font-semibold text-red-500 text-left flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-lg font-semibold text-brand-secondary"
            onClick={onClose}
          >
            Admin Access
          </Link>
        )}
      </nav>
    </div>
  );
}
