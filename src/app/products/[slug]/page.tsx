"use client";

import { SectionHero } from "@/component/product/SectionHero";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories, fetchProducts, fetchSubCategories } from "@/lib/api";
import { parseMetadata } from "@/lib/utils";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { EmptyCategory } from "./components/EmptyCategory";
import { ProductGrid } from "./components/ProductGrid";

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
        const [allCategories, allSubCategories, allProducts] = await Promise.all([
          fetchCategories(),
          fetchSubCategories(),
          fetchProducts()
        ]);

        let foundCategory = allCategories.find((c: any) => c.slug === slug);
        let foundSubCategory = null;

        if (!foundCategory) {
          foundSubCategory = allSubCategories.find((s: any) => s.slug === slug);
        }

        if (!foundCategory && !foundSubCategory) {
          setIsLoading(false);
          return;
        }

        const activeItem = foundCategory || foundSubCategory;
        const { text, metadata } = parseMetadata(activeItem.description);
        setCategoryData({ ...activeItem, description: text, ...metadata });

        if (foundCategory) {
          // Parent Category: Show all products under this category AND its sub-categories
          const subIds = allSubCategories
            .filter((s: any) => s.categoryId === foundCategory.id)
            .map((s: any) => s.id);
          
          const filteredProducts = allProducts.filter((p: any) => 
            p.categoryId === foundCategory.id || (p.subCategoryId && subIds.includes(p.subCategoryId))
          );
          setItems(filteredProducts);
          setIsSubcategoryPage(false);
        } else {
          // Sub-Category: Show only products under this sub-category
          const filteredProducts = allProducts.filter((p: any) => p.subCategoryId === foundSubCategory.id);
          setItems(filteredProducts);
          setIsSubcategoryPage(true);
        }
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
