"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SubCategoryTableProps = {
  data: any[];
  categories: any[];
  onEdit: (sub: any) => void;
  onDelete: (id: string) => void;
};

export default function SubCategoryTable({ data, categories, onEdit, onDelete }: SubCategoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const parent = categories.find((c) => c.id === item.categoryId);
            return (
              <TableRow key={item.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                    {parent?.name || "Unknown"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500">{item.slug}</TableCell>
                <TableCell className="text-gray-400 max-w-[300px] truncate">
                  {item.description}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                No subcategories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}