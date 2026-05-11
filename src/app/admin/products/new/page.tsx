"use client";

import { useState, useEffect } from "react";
import { CreateProductForm } from "../../components/CreateProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories, fetchSubCategories, createProduct } from "@/lib/api";
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
        const [categoriesData, subCategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSubCategories()
        ]);
        
        // Nest categories so ProductForm can detect subcategories
        const topLevel = categoriesData.filter((cat: any) => !cat.categoryId);
        const nested = topLevel.map((parent: any) => ({
          ...parent,
          subcategory: subCategoriesData.filter((sub: any) => sub.categoryId === parent.id)
        }));

        setCategories(nested);
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
      if (data.subCategoryId) {
        formData.append("subCategoryId", data.subCategoryId);
      }
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

      const response = await createProduct(token, formData);
      if (response.success === false) {
        const errorMessage = response.error?.details?.issues?.[0]?.message || response.message || "Failed to create product";
        toast.error(errorMessage);
        return;
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Error creating product:", err);
      const errorMessage = err.error?.details?.issues?.[0]?.message || err.message || "Failed to create product";
      toast.error(errorMessage);
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
          <CreateProductForm 
            categories={categories} 
            onSubmit={handleAddProduct} 
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
