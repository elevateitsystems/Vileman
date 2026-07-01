// app/admin/products/[slug]/edit/[id]/page.tsx
"use client";

import { use, useState, useEffect } from "react";
// import { EditProductForm } from "@/components/EditProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchProductById,
  fetchCategories,
  fetchSubCategories,
  updateProduct,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { parseMetadata } from "@/lib/utils";
import { toast } from "react-toastify";
import { EditProductForm } from "@/app/admin/components/EditProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
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
        const [prodData, catsData, subCatsData] = await Promise.all([
          fetchProductById(resolvedParams.id),
          fetchCategories(),
          fetchSubCategories(),
        ]);
        const { text, metadata } = parseMetadata(prodData.description);

        // Nest categories so EditProductForm can detect subcategories
        const topLevel = catsData.filter((cat: any) => !cat.categoryId);
        const nested = topLevel.map((parent: any) => ({
          ...parent,
          subcategory: subCatsData.filter(
            (sub: any) => sub.categoryId === parent.id,
          ),
        }));

        // Map backend data back to form values
        const formInitialData = {
          ...prodData,
          ...metadata,
          description: text || prodData.description,
          categoryId: prodData.categoryId,
          subCategoryId: prodData.subCategoryId || "",
          price: parseFloat(prodData.price),
          isCustomizable: prodData.isCustomizable ?? false,
          image: prodData.image || prodData.images?.[0]?.url || "",
        };

        setProduct(formInitialData);
        setCategories(nested);
      } catch (error) {
        console.error("Failed to load product edit data:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [resolvedParams.id]);

  const handleUpdateProduct = async (formData: FormData) => {
    if (!token || !product) {
      toast.error("Authentication required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Debug: Log all FormData entries
      console.log("📦 Submitting FormData:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send FormData directly to API
      const response = await updateProduct(token, product.id, formData);
      
      if (response.success === false) {
        const errorMessage =
          response.error?.details?.issues?.[0]?.message ||
          response.message ||
          "Failed to update product";
        toast.error(errorMessage);
        return;
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Error updating product:", err);
      const errorMessage =
        err.error?.details?.issues?.[0]?.message ||
        err.message ||
        "Failed to update product";
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
          <h1 className="text-[28px] font-bold text-brand-primary">
            Edit Product
          </h1>
          <p className="text-gray-500">
            Modify the details for "{product?.name || "..."}".
          </p>
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
          <EditProductForm
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