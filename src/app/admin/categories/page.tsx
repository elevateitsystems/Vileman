"use client";

import { useState, useEffect } from "react";
import { fetchCategories, fetchSubCategories, createCategory, deleteCategory, deleteSubCategory, createSubCategory } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Layers,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CategoryForm } from "../components/CategoryForm";
import { SubCategoryForm } from "../components/SubCategoryForm";
import { cn, parseMetadata } from "@/lib/utils";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "category" | "subcategory" } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        fetchCategories(),
        fetchSubCategories()
      ]);
      setCategories(cats);
      setSubCategories(subs);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredSubCategories = subCategories.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateCategory = async (data: any) => {
    if (!token) return;
    try {
      await createCategory(token, {
        name: data.name,
        description: data.description || "",
      });
      setIsCategoryModalOpen(false);
      toast.success("Category created successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    }
  };

  const handleCreateSubCategory = async (data: any) => {
    if (!token) return;
    try {
      await createSubCategory(token, {
        name: data.name,
        description: data.description || "",
        categoryId: data.categoryId,
      });
      setIsSubCategoryModalOpen(false);
      toast.success("Subcategory created successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create subcategory");
    }
  };

  const confirmDelete = async () => {
    if (!token || !itemToDelete) return;
    try {
      if (itemToDelete.type === "subcategory") {
        await deleteSubCategory(token, itemToDelete.id);
      } else {
        await deleteCategory(token, itemToDelete.id);
      }
      toast.success("Deleted successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary">
            Categories
          </h1>
          <p className="text-gray-500">
            Organize your products into categories and subcategories.
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isSubCategoryModalOpen}
            onOpenChange={setIsSubCategoryModalOpen}
          >
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary/5 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Subcategory
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
                <DialogDescription>
                  Create a new subcategory and link it to a parent category.
                </DialogDescription>
              </DialogHeader>
              <SubCategoryForm categories={categories} onSubmit={handleCreateSubCategory} />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isCategoryModalOpen}
            onOpenChange={setIsCategoryModalOpen}
          >
            <DialogTrigger
              render={
                <Button className="bg-brand-primary hover:bg-brand-primary/90 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Category
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a top-level category for your store.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm onSubmit={handleCreateCategory} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative",
            activeTab === "categories" ? "text-brand-primary" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Categories
          {activeTab === "categories" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative",
            activeTab === "subcategories" ? "text-brand-primary" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Subcategories
          {activeTab === "subcategories" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={`Search ${activeTab === "categories" ? "categories" : "subcategories"}...`}
            className="pl-10 border-gray-100 focus:ring-brand-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold w-[40px]"></TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Slug</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="text-right font-bold w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold w-[40px]"></TableHead>
                <TableHead className="font-bold">Name</TableHead>
                {activeTab === "subcategories" && <TableHead className="font-bold">Parent Category</TableHead>}
                <TableHead className="font-bold">Slug</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === "categories" ? filteredCategories : filteredSubCategories).map((item) => {
                const { text } = parseMetadata(item.description);
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell>
                      <Layers className="h-5 w-5 text-brand-secondary" />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    {activeTab === "subcategories" && (
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                          {categories.find(c => c.id === item.categoryId)?.name || "Unknown"}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-gray-500">{item.slug}</TableCell>
                    <TableCell className="text-gray-400 max-w-[300px] truncate">
                      {text || item.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                        onClick={() => {
                          setItemToDelete({ id: item.id, type: activeTab === "categories" ? "category" : "subcategory" });
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {(activeTab === "categories" ? filteredCategories : filteredSubCategories).length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No {activeTab} found.
            </div>
          )}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete?.type === 'category' ? 'category' : 'subcategory'}
              and all of its associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete {itemToDelete?.type === 'category' ? 'Category' : 'Subcategory'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
