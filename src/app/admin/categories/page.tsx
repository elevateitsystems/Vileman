"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CategoriesProvider } from "./components/CategoriesProvider";
import CategoryList from "./components/CategoryList";
import SubCategoryList from "./components/SubCategoryList";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");

  return (
    <CategoriesProvider token={token}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-brand-primary">Categories</h1>
            <p className="text-gray-500">Organize your products into categories and subcategories.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "categories" ? "text-brand-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Categories
            {activeTab === "categories" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
          </button>
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "subcategories" ? "text-brand-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Subcategories
            {activeTab === "subcategories" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
          </button>
        </div>

        {activeTab === "categories" ? <CategoryList /> : <SubCategoryList />}
      </div>
    </CategoriesProvider>
  );
}