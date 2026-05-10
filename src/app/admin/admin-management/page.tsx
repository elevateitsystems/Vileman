"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Mail,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";
import { fetchAdmins } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AdminManagementPage() {
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0
  });

  const token = useAuth((state) => state.token);

  // Debouncing logic for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadAdmins = useCallback(async () => {
    if (!token) return;
    
    setIsFetching(true);
    try {
      const response = await fetchAdmins(token, {
        search: debouncedSearch,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.success) {
        setAdmins(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            totalPages: response.pagination.totalPages,
            total: response.pagination.total
          }));
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load admins");
    } finally {
      setIsFetching(false);
    }
  }, [token, debouncedSearch, pagination.page, pagination.limit]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);



  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary">Admin Management</h1>
          <p className="text-gray-500">
            Manage your team and administrative access.
          </p>
        </div>
        
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search admins by name or email..."
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
              <TableHead className="font-bold">Admin</TableHead>
              <TableHead className="font-bold">Username</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                  <TableCell>
                    <Shield className="h-5 w-5 text-brand-secondary" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                        {admin.firstName?.[0] || 'A'}{admin.lastName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{admin.firstName} {admin.lastName}</p>
                        <p className="text-[14px] text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">{admin.username || 'N/A'}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[12px] font-medium text-indigo-600">
                      {admin.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[12px] font-medium",
                      admin.status === 'active' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {admin.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-gray-500">
                  No admins found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        {!isFetching && admins.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/30">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900">{admins.length}</span> of <span className="text-gray-900">{pagination.total}</span> admins
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-gray-200"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={pagination.page === p ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 w-9 rounded-lg font-bold text-xs",
                      pagination.page === p ? "bg-brand-primary" : "border-gray-200 text-gray-500"
                    )}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-gray-200"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
