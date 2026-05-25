"use client";

import { useState, useEffect } from "react";
import { fetchOrders } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  const loadOrders = async (currentPage: number) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetchOrders(token, { page: currentPage, limit });
      setOrders(response.data || []);
      if (response.meta?.pagination) {
        setPagination(response.meta.pagination);
      }
    } catch (error: any) {
      console.error("Failed to load orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(page);
  }, [page, token]);

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevious) {
      setPage((prev) => prev - 1);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Order Management
          </h1>
          <p className="text-gray-500">
            View and manage customer orders.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search orders by order number, email or phone..."
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
                <TableHead className="font-bold">Order Number</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Payment</TableHead>
                <TableHead className="font-bold">Total</TableHead>
                <TableHead className="text-right font-bold w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
                <TableHead className="font-bold">Order Number</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Payment Status</TableHead>
                <TableHead className="font-bold">Total Amount</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-brand-primary">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-gray-900">{order.customerEmail}</span>
                        <span className="text-[12px] text-gray-500">{order.customerPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest",
                        order.paymentStatus === 'paid' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">
                      €{parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                          title="View Details"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No orders found matching your search.
            </div>
          )}
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing page {page} of {pagination.totalPages} ({pagination.total} total orders)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPrevious || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Viewing full details for order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mt-4 space-y-8">
              {/* Top Section: Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total</span>
                  <p className="mt-1 text-lg font-bold text-[#181b31]">€{parseFloat(selectedOrder.totalAmount).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</span>
                  <p className="mt-1 text-[13px] font-bold uppercase tracking-widest text-[#181b31]">{selectedOrder.paymentStatus}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Date</span>
                  <p className="mt-1 text-[13px] font-medium text-[#181b31]">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Items</span>
                  <p className="mt-1 text-lg font-bold text-[#181b31]">{selectedOrder.items?.length || 0}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-[14px] font-bold uppercase tracking-widest text-[#181b31] mb-4">Customer Info</h3>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[12px] text-gray-400 mb-1">Email</span>
                    <span className="text-[14px] font-medium">{selectedOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="block text-[12px] text-gray-400 mb-1">Phone</span>
                    <span className="text-[14px] font-medium">{selectedOrder.customerPhone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[12px] text-gray-400 mb-1">Shipping Country</span>
                    <span className="text-[14px] font-medium uppercase">{selectedOrder.shippingCountry || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[12px] text-gray-400 mb-1">Session ID</span>
                    <span className="text-[12px] text-gray-400 break-all">{selectedOrder.stripeSessionId}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-[14px] font-bold uppercase tracking-widest text-[#181b31] mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-[16px] text-[#181b31]">{item.product?.name || "Unknown Product"}</h4>
                            <p className="text-[12px] text-gray-400 mt-1">Quantity: {item.quantity} × €{parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <span className="font-bold text-[16px] text-[#181b31]">€{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                        </div>
                        
                        {/* Customizations */}
                        {item.customization && (
                          <div className="mt-4 pt-4 border-t border-gray-50">
                            <h5 className="text-[12px] font-bold uppercase tracking-widest text-brand-primary mb-3">Customization Details</h5>
                            
                            {/* Selections */}
                            {item.customization.selections && (
                              <div className="flex gap-4 mb-3">
                                {Object.entries(item.customization.selections).map(([key, val]) => (
                                  <div key={key} className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">{key}</span>
                                    <span className="text-[13px] font-medium text-gray-900">{val as string}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Comment */}
                            {item.customization.comment && (
                              <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <span className="text-[10px] font-bold text-yellow-600 block uppercase tracking-wider mb-1">Customer Note</span>
                                <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{item.customization.comment}</p>
                              </div>
                            )}

                            {/* Images */}
                            {item.customization.images && item.customization.images.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider mb-2">Attached Files</span>
                                <div className="flex flex-wrap gap-2">
                                  {item.customization.images.map((img: any, idx: number) => (
                                    <a 
                                      key={idx} 
                                      href={img.url} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="block relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                                    >
                                      <Image src={img.url} alt="Customization" fill className="object-cover" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button onClick={() => setIsDetailsModalOpen(false)}>Close Details</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
