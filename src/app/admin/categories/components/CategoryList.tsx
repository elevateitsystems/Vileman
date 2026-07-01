"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { createCategory, deleteCategory, updateCategory } from "@/lib/api";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCategories } from "./CategoriesProvider";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";

export default function CategoryList() {
  const { categories, refresh } = useCategories();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!token) {
      toast.error("Please login again");
      return;
    }

    console.log("handleSubmit received data:", data); // ← Debug

    setIsSubmitting(true);
    try {
      if (editingItem) {
        console.log({ editingItem }, { data });
        await updateCategory(token, editingItem.id, data);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(token, data);
        toast.success("Category created successfully!");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await refresh();
    } catch (err: any) {
      console.error("Full error:", err);
      toast.error(
        err.message || err.error?.message || "Failed to save category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(token, id);
      toast.success("Category deleted");
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingItem(null);
          }}
        >
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CategoryTable
        data={categories}
        onEdit={(cat) => {
          setEditingItem(cat);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />
    </>
  );
}
