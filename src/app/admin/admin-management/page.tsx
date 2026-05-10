"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  User,
  Loader2,
  ShieldCheck,
  Edit,
  Trash2,
  Lock
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

export default function AdminManagementPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Mock data for display - in real app fetch from API
  const admins = [
    {
      id: "1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@vileman.com",
      role: "admin",
      status: "active",
      username: "@admin_user"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const username = `@${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`;
      
      const payload = {
        ...formData,
        username,
        confirmPassword: formData.password,
        role: "admin",
      };

      const response = await register(payload);

      if (response.success) {
        toast.success("Admin invited successfully!");
        setIsOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
      } else {
        toast.error(response.message || "Failed to add admin");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary">Admin Management</h1>
          <p className="text-gray-500">
            Manage your team and administrative access.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
            <form onSubmit={handleAddAdmin}>
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="mx-auto bg-brand-primary/10 p-3 rounded-full w-fit mb-4">
                    <UserPlus className="h-8 w-8 text-brand-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center text-brand-primary">Invite New Admin</DialogTitle>
                  <DialogDescription className="text-center text-[16px]">
                    Create a new administrative account.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@vileman.com" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" title="Temporary Password" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        id="password" 
                        type="password" 
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-gray-50/50 p-6 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl h-12 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl h-12 px-8"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Invite Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
              <TableHead className="font-bold">Admin</TableHead>
              <TableHead className="font-bold">Username</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                      {admin.firstName[0]}{admin.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{admin.firstName} {admin.lastName}</p>
                      <p className="text-[14px] text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 font-medium">{admin.username}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-indigo-50 text-[12px] font-medium text-indigo-600">
                    {admin.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[12px] font-medium",
                    admin.status === 'active' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-brand-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAdmins.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No admins found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

