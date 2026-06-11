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
import {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "@/lib/api";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCategories } from "./CategoriesProvider";
import SubCategoryForm from "./SubCategoryForm";
import SubCategoryTable from "./SubCategoryTable";

export default function SubCategoryList() {
  const { categories, subCategories, refresh } = useCategories();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!token) {
      toast.error("Please login again");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateSubCategory(token, editingItem.id, data);
        toast.success("Subcategory updated successfully!");
      } else {
        await createSubCategory(token, data);
        toast.success("Subcategory created successfully!");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await refresh();
    } catch (err: any) {
      toast.error(
        err.message || err.error?.message || "Failed to save subcategory",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this subcategory?")) return;
    try {
      await deleteSubCategory(token, id);
      toast.success("Subcategory deleted");
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
              <Plus className="mr-2 h-4 w-4" /> Add Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Subcategory" : "Create Subcategory"}
              </DialogTitle>
            </DialogHeader>
            <SubCategoryForm
              categories={categories}
              initialData={editingItem}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SubCategoryTable
        data={subCategories}
        categories={categories}
        onEdit={(sub) => {
          setEditingItem(sub);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />
    </>
  );
}
