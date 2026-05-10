"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuth((state) => state.token);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(token, data.currentPassword, data.newPassword, data.confirmNewPassword);
      if (response.success) {
        toast.success("Password updated successfully!");
        form.reset();
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl text-brand-primary">Change Password</CardTitle>
        <CardDescription>
          Update your admin account password to keep your dashboard secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold uppercase tracking-wider text-xs">Current Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      // className="h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold uppercase tracking-wider text-xs">New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      // className="h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold uppercase tracking-wider text-xs">Confirm New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      // className="h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className='bg-brand-primary hover:bg-brand-primary/90'
              // className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
