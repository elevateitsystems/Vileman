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
  console.log({ initialData });
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.image?.url || null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", (description || "").trim());

    if (image) {
      formData.append("image", image);
    }

    // Strong debug
    // console.log("FormData keys:", Array.from(formData.keys()));
    console.log({ formData });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <Label>Image</Label>
        {preview && (
          <div className="mb-3 relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
        )}
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {initialData && (
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep current image
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData
            ? "Update Category"
            : "Create Category"}
      </Button>
    </form>
  );
}
