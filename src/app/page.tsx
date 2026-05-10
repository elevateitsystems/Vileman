"use client";

import { useEffect, useState } from "react";
import SectionHero from "@/component/layout/SectionHero";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { PhotoGrid } from "./components/PhotoGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { parseMetadata } from "@/lib/utils";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        // Map backend products to what FeaturedProducts expects
        const mapped = productsData.slice(0, 4).map((p: any) => {
          const category = categoriesData.find((c: any) => c.id === p.categoryId);
          const categorySlug = category ? category.slug : "all";
          const { text, metadata } = parseMetadata(p.description);
          
          const images = p.images || [];
          const imageSrc = images.length > 0 
            ? (typeof images[0] === 'string' ? images[0] : images[0].url)
            : (metadata.image || p.image || "");
          
          return {
            id: p.id,
            href: `/products/${categorySlug}/${p.slug}`,
            imageSrc,
            name: p.name,
            price: parseFloat(p.price) || 0,
            description: text || p.description,
            shortDescription: metadata.shortDescription || p.shortDescription,
            slug: p.slug,
          };
        });
        setProducts(mapped);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const photoGrid = [
    { src: "/img/build/pics/easter/easter1.png", title: "Happy Easter" },
    {
      src: "/img/build/pics/prod_cloths/p-cloth-7.png",
      title: "Kitchen cloth",
    },
    { src: "/img/build/pics/prod_mugs/p-mug-31.png", title: "Oh Deer mug" },
    { src: "/img/build/pics/balloon/balloon1.png", title: "Balloon gift" },
    { src: "/img/build/pics/prod_mugs/p-mug-4.png", title: "Funny mug" },
    { src: "/img/build/pics/misc/tissue-1.png", title: "Tissue" },
  ];

  return (
    <div className="flex flex-col">
      <SectionHero
        title="Fo oldal cime"
        description={
          <>
            <p>Rovid bemutatkozo szoveg vagy hasonlo</p>
            <p>
              Ahol megprobalod felhivni az emberek figyelmet erre a{" "}
              <strong className="text-black font-semibold">
                csodalatos weblapra
              </strong>{" "}
              ami ezmellett meg fantasztikus is.
            </p>
            <p>
              Ez lesz a legjobb weblap{" "}
              <strong className="text-black font-semibold">
                10 ev mulva is!
              </strong>
            </p>
          </>
        }
        roundedBottom={false}
        className="pt-20 pb-16"
      />

      {isLoading ? (
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FeaturedProducts products={products} />
      )}

      <PhotoGrid photos={photoGrid} />
    </div>
  );
}
