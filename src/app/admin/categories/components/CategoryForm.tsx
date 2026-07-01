"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type CategoryFormProps = {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
};

export default function CategoryForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.image?.url || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", (description || "").trim());

    if (image) {
      formData.append("image", image);
    }

    // Debug log
    console.log("📦 FormData being submitted:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      
      // Reset form after successful submission (if not editing)
      if (!initialData) {
        setName("");
        setDescription("");
        setImage(null);
        setPreview(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine if the preview is a blob URL (new image)
  const isBlobUrl = (url: string | null) => {
    return url?.startsWith('blob:') || false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting || isLoading}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={isSubmitting || isLoading}
        />
      </div>

      <div>
        <Label>Image</Label>
        {preview && (
          <div className="mb-3 relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image 
              src={isBlobUrl(preview) ? preview : `/api/image?url=${encodeURIComponent(preview)}`}
              alt="Preview" 
              fill 
              className="object-cover"
              unoptimized={isBlobUrl(preview)}
            />
          </div>
        )}
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          disabled={isSubmitting || isLoading}
        />
        {initialData && (
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep current image
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
        {isSubmitting || isLoading
          ? "Saving..."
          : initialData
            ? "Update Category"
            : "Create Category"}
      </Button>
    </form>
  );
}