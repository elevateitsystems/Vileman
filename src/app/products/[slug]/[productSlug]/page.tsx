"use client";

import { useEffect, useState, use } from "react";
import { fetchCategories, fetchSubCategories, fetchProducts } from "@/lib/api";
import { notFound } from "next/navigation";
import { SectionHero } from "@/component/product/SectionHero";
import { ProductGallery } from "./components/ProductGallery";
import { ProductOrderCard } from "./components/ProductOrderCard";
import { ProductDescription } from "./components/ProductDescription";
import { parseMetadata } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import placeholderImg from "@/assets/placeholder.svg";

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const params = use(paramsPromise);
  const { slug, productSlug } = params;

  const [category, setCategory] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        const activeCategory = foundCategory || foundSubCategory;
        const { metadata } = parseMetadata(activeCategory.description);
        setCategory({ ...activeCategory, ...metadata });

        const foundProduct = allProducts.find((p: any) => p.slug === productSlug);

        if (!foundProduct) {
          setIsLoading(false);
          return;
        }

        // Process product images to use the API endpoint
        const processedProduct = {
          ...foundProduct,
          images: foundProduct.images?.map((img: any) => {
            const imageUrl = typeof img === 'string' ? img : img.url;
            return `/api/image?url=${encodeURIComponent(imageUrl)}`;
          }) || [],
          image: foundProduct.image 
            ? `/api/image?url=${encodeURIComponent(foundProduct.image)}` 
            : null
        };

        setProduct(processedProduct);

        // Fetch other products in same category/sub-category for the gallery
        const filteredProducts = allProducts.filter((p: any) => 
          foundCategory ? p.categoryId === foundCategory.id : p.subCategoryId === foundSubCategory.id
        );
        
        // Process gallery products images as well
        const processedGalleryProducts = filteredProducts.map((p: any) => ({
          ...p,
          images: p.images?.map((img: any) => {
            const imageUrl = typeof img === 'string' ? img : img.url;
            return `/api/image?url=${encodeURIComponent(imageUrl)}`;
          }) || [],
          image: p.image 
            ? `/api/image?url=${encodeURIComponent(p.image)}` 
            : null
        }));
        
        setCategoryProducts(processedGalleryProducts);

      } catch (error) {
        console.error("Failed to load product detail:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, productSlug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfcfc]">
        <Skeleton className="h-[400px] w-full rounded-none" />
        <div className="container max-w-6xl mx-auto px-4 md:px-0 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category || !product) {
    notFound();
  }

  return (
    <div className="product-detail-page flex min-h-screen flex-col bg-[#fcfcfc]">
      <SectionHero 
        backgroundImage={category.heroImage || "/img/build/pics/misc/bgcl1.png"} 
        heading={category.name} 
      />

      <section className="container max-w-6xl mx-auto px-4 md:px-0 pb-24 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery 
            images={product.images && product.images.length > 0 
              ? product.images 
              : [product.image || placeholderImg]} 
            name={product.name} 
          />
          <ProductOrderCard product={product} />
        </div>

        <ProductDescription product={product} />
      </section>
    </div>
  );
}