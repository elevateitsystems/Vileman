"use client";

import { useState, useEffect } from "react";
import { ProductForm } from "../../components/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories, createProduct } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleAddProduct = async (data: any) => {
    if (!token) return;
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

      if (data.fileObjects && data.fileObjects.length > 0) {
        data.fileObjects.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      await createProduct(token, formData);
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
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
          <h1 className="text-[28px] font-bold text-brand-primary">Add New Product</h1>
          <p className="text-gray-500">Create a new product listing in your catalog.</p>
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
            onSubmit={handleAddProduct} 
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
