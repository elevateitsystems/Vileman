"use client";

import { useEffect, useState, use } from "react";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { notFound } from "next/navigation";
import { SectionHero } from "@/component/product/SectionHero";
import { ProductGrid } from "./components/ProductGrid";
import { EmptyCategory } from "./components/EmptyCategory";
import { parseMetadata } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(paramsPromise);
  const { slug } = params;
  
  const [categoryData, setCategoryData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubcategoryPage, setIsSubcategoryPage] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const allCategories = await fetchCategories();
        const category = allCategories.find((c: any) => c.slug === slug);

        if (!category) {
          setIsLoading(false);
          return;
        }

        const { text, metadata } = parseMetadata(category.description);
        setCategoryData({ ...category, description: text, ...metadata });

        // Fetch products for this category
        const allProducts = await fetchProducts();
        const filteredProducts = allProducts.filter((p: any) => p.categoryId === category.id);
        
        // Check if there are subcategories (not directly supported by fetchCategories response 
        // if it doesn't nest, but we can check if any category has this one as parent if we had that info)
        // For now, we'll assume products are what we show.
        setItems(filteredProducts);
        setIsSubcategoryPage(false); 
      } catch (error) {
        console.error("Failed to load category data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfcfc]">
        <Skeleton className="h-[400px] w-full rounded-none" />
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="product-page flex min-h-screen flex-col bg-[#fcfcfc]">
      <SectionHero
        backgroundImage={categoryData.heroImage || "/img/build/pics/misc/bgcl1.png"}
        heading={categoryData.heading || categoryData.name}
        description={categoryData.description}
        priceRange={categoryData.priceRange}
      />

      {items.length > 0 ? (
        <ProductGrid
          slug={slug}
          items={items}
          isSubcategoryPage={isSubcategoryPage}
        />
      ) : (
        <EmptyCategory />
      )}
    </div>
  );
}
