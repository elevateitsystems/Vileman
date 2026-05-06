"use client";

import { useState } from "react";
import { categories as initialCategories } from "@/lib/products";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Layers,
  Subtitles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "../components/CategoryForm";
import { SubCategoryForm } from "../components/SubCategoryForm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateCategory = (data: any) => {
    console.log("Creating category:", data);
    setIsCategoryModalOpen(false);
    alert("Category data captured! Backend integration needed.");
  };

  const handleCreateSubCategory = (data: any) => {
    console.log("Creating subcategory:", data);
    setIsSubCategoryModalOpen(false);
    alert("Subcategory data captured! Backend integration needed.");
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
              <SubCategoryForm onSubmit={handleCreateSubCategory} />
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

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search categories..."
            className="pl-10 border-gray-100 focus:ring-brand-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold w-[40px]"></TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Slug</TableHead>
              <TableHead className="font-bold">Subcategories</TableHead>
              <TableHead className="font-bold">Products</TableHead>
              {/* <TableHead className="text-right font-bold">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((cat) => (
              <TableRow
                key={cat.slug}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell>
                  <Layers className="h-5 w-5 text-brand-secondary" />
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-gray-500">{cat.slug}</TableCell>
                <TableCell>{cat.subcategory?.length || 0}</TableCell>
                <TableCell>{cat.items?.length || 0}</TableCell>
                {/* <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
