"use client";

import { use } from "react";
import { ProductForm } from "../../../components/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { notFound } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = products.find(p => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const handleUpdateProduct = (data: any) => {
    console.log("Updating product:", data);
    alert("Product update captured! Backend integration needed to save.");
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
          <p className="text-gray-500">Modify the details for "{product.name}".</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
        <ProductForm initialData={product} onSubmit={handleUpdateProduct} />
      </div>
    </div>
  );
}
