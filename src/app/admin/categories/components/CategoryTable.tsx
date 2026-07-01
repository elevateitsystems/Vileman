"use client";

import Image from "next/image";
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

type CategoryTableProps = {
  data: any[];
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
};

export default function CategoryTable({ data, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/50">
              <TableCell>
                {item.image?.url ? (
                  <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                    <Image src={`/api/image?url=${encodeURIComponent(item.image.url)}`} alt={item.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    📷
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
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
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}