"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type SubCategoryFormProps = {
  categories: any[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;   // Changed to any (JSON object)
  isLoading?: boolean;
};

export default function SubCategoryForm({
  categories,
  initialData,
  onSubmit,
  isLoading = false,
}: SubCategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please select a parent category");
      return;
    }

    const payload = {
      name,
      description,
      categoryId,
    };

    onSubmit(payload);   // Send plain object (JSON)
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
        <Label>Parent Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger className="w-full">
            <span className="flex flex-1 text-left text-sm">
              {categoryId && selectedCategoryName
                ? selectedCategoryName
                : "Select parent category"}
            </span>
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData
            ? "Update Subcategory"
            : "Create Subcategory"}
      </Button>
    </form>
  );
}