"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { deleteProduct, fetchProducts, updateProduct } from "@/lib/api";
import { cn, parseMetadata } from "@/lib/utils";
import {
  Edit,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleStatus = async (product: any) => {
    if (!token) return;
    const newStatus = product.status === 'inactive' ? 'active' : 'inactive';
    try {
      await updateProduct(token, product.id, { status: newStatus });
      toast.success(`Product marked as ${newStatus}`);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!token || !productToDelete) return;
    try {
      await deleteProduct(token, productToDelete);
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
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

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold w-[60px]"></TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Stock</TableHead>
                <TableHead className="text-right font-bold w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
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
              {filteredProducts.map((product) => {
                const { metadata } = parseMetadata(product.description);
                const images = product.images || [];
                const displayImage = images.length > 0 
                  ? (typeof images[0] === 'string' ? images[0] : images[0].url)
                  : (metadata.image || product.image || "/assets/placeholder.svg");
                
                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={displayImage || "/assets/placeholder.svg"}
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
                        {product.category?.name || "Uncategorized"}
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
                      €{parseFloat(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell>{product.quantity || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* <Link href={`/admin/products/${product.slug}/edit/${product.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 border-gray-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link> */}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                          onClick={() => {
                            setProductToDelete(product.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove its data from our servers.
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
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
