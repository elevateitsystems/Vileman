"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api";
import { SectionHero } from "@/component/product/SectionHero";
import { CategoryGrid } from "./components/CategoryGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCategories();
        // Filter out subcategories if needed, but for now we show all top-level categories
        // We'll filter based on presence of a parent if the backend provides it, 
        // or just show all for now and adjust mapping later.
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="products-overview-page flex min-h-screen flex-col bg-[#fcfcfc]">
      <SectionHero
        backgroundImage="/img/build/pics/misc/bgcl1.png"
        heading="Our Collections"
        description="Discover our wide range of premium kitchen linens, custom mugs, and unique gifts designed to add a personal touch to your home."
      />
      
      {isLoading ? (
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </div>
  );
}
