"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users,
  Package, 
  Layers, 
  Settings, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    name: "Products",
    href: "/admin/products",
    icon: Package
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Layers
  },
  {
    name: "Order Management",
    href: "/admin/orders",
    icon: ShoppingCart
  },
  {
    name: "Admin Management",
    href: "/admin/admin-management",
    icon: Users
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logout = useAuth((state) => state.logout);
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/");
  };

  return (
    <div className="flex min-h-[calc(100vh-74px)] bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-76 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-gray-400 mb-6">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-brand-primary/10 text-brand-primary font-bold shadow-sm" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", isActive ? "text-brand-primary" : "text-gray-400 group-hover:text-brand-primary")} />
                    <span className="text-[16px]">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-[16px]">Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-brand-primary blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-brand-secondary blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
