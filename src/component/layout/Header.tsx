"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { categories } from "@/lib/products";
import { DesktopNav } from "./components/DesktopNav";
import { MobileNav } from "./components/MobileNav";
import { CartBadge } from "./components/CartBadge";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  // Filter to show top-level categories and handle subcategories
  const mainCategories = categories.filter(
    (cat) => !cat.slug.startsWith("cloth-") || cat.slug === "cloth-menu"
  );

  // Generate initials and random color for avatar placeholder
  const getInitials = () => {
    if (!user) return "??";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const getAvatarColor = () => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
    const index = (user?.firstName?.length || 0) % colors.length;
    return colors[index];
  };

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
          <DesktopNav categories={mainCategories} />

          {/* Right Actions */}
          <div className="flex-1 flex items-center justify-end gap-5">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-all outline-none">
                    {user?.avatar ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-brand-primary/20">
                        <Image src={user.avatar} alt={user.displayName} width={40} height={40} className="object-cover" />
                      </div>
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm ${getAvatarColor()}`}>
                        {getInitials()}
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-gray-100">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user?.displayName}</p>
                        <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user?.role === 'admin' && (
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2">
                          <UserIcon className="h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer rounded-lg gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:block text-[18px] font-normal tracking-[0.05em] text-black hover:text-[#735c92] transition-colors"
              >
                Admin
              </Link>
            )}

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
