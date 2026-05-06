"use client";

import { useState } from "react";
import { products as initialProducts, categories } from "@/lib/products";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Power,
  PowerOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetails } from "../components/ProductDetails";
import Image from "next/image";
import { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const toggleStatus = (slug: string) => {
    setProducts(prev => prev.map(p => {
      if (p.slug === slug) {
        return { ...p, status: p.status === 'inactive' ? 'active' : 'inactive' };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary">Products</h1>
          <p className="text-gray-500">
            Manage your store&apos;s inventory and details.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-brand-primary hover:bg-brand-primary/90 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search products by name, slug or category..."
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
              <TableHead className="font-bold">Image</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Price</TableHead>
              <TableHead className="font-bold">Stock</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.slug}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-[12px] font-medium text-gray-600">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[12px] font-medium",
                    product.status === 'inactive' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                  )}>
                    {product.status || 'active'}
                  </span>
                </TableCell>
                <TableCell className="text-brand-primary font-bold">
                  ${product.price}
                </TableCell>
                <TableCell>{product.quantity || 0}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <Link href={`/admin/products/${product.slug}/edit`}>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" /> View Page
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className={cn(
                          "flex items-center gap-2 cursor-pointer font-medium",
                          product.status === 'inactive' ? "text-green-600" : "text-amber-600"
                        )}
                        onClick={() => toggleStatus(product.slug)}
                      >
                        {product.status === 'inactive' ? (
                          <>
                            <Power className="h-4 w-4" /> Mark Active
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-4 w-4" /> Mark Inactive
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && <ProductDetails product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
