"use client";

import { use, useState, useEffect } from "react";
import { ProductForm } from "../../../components/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductBySlug, fetchCategories, updateProduct } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { parseMetadata } from "@/lib/utils";
import { toast } from "react-toastify";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { token } = useAuth();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [prodData, catsData] = await Promise.all([
          fetchProductBySlug(resolvedParams.slug),
          fetchCategories()
        ]);

        const metadata = parseMetadata(prodData.description);
        
        // Map backend data back to form values
        const formInitialData = {
          ...prodData,
          ...metadata,
          description: metadata.text || prodData.description,
          categoryId: prodData.categoryId,
          price: parseFloat(prodData.price)
        };

        setProduct(formInitialData);
        setCategories(catsData);
      } catch (error) {
        console.error("Failed to load product edit data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [resolvedParams.slug]);

  const handleUpdateProduct = async (data: any) => {
    if (!token || !product) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId);
      formData.append("quantity", (data.quantity || 0).toString());

      const descriptionJson = JSON.stringify({
        text: data.description,
        shortDescription: data.shortDescription,
        dimensions: data.dimensions,
        print: data.print,
        paper: data.paper
      });
      formData.append("description", descriptionJson);

      // Append new files if any
      if (data.fileObjects && data.fileObjects.length > 0) {
        data.fileObjects.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      await updateProduct(token, product.id, formData);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary">Edit Product</h1>
          <p className="text-gray-500">Modify the details for "{product?.name || "..."}".</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-4">
              <Skeleton className="h-28 w-28 rounded-xl" />
              <Skeleton className="h-28 w-28 rounded-xl" />
              <Skeleton className="h-28 w-28 rounded-xl border-2 border-dashed" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
          <ProductForm 
            categories={categories}
            initialData={product} 
            onSubmit={handleUpdateProduct} 
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
