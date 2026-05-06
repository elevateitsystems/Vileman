"use client";

import { ProductForm } from "../../components/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  const handleAddProduct = (data: any) => {
    console.log("Adding product:", data);
    alert("Product data captured! Backend integration needed to save.");
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

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
        <ProductForm onSubmit={handleAddProduct} />
      </div>
    </div>
  );
}
