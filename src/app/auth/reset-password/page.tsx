"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2, KeyRound } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { toast } from "react-toastify";

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!email) {
      toast.error("Email is missing. Please start over.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await resetPassword(email, newPassword);
      if (response.success) {
        toast.success("Password reset successful! Please log in.");
        router.push("/auth/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <Card className="w-full max-w-[450px] z-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="mx-auto bg-brand-primary/10 p-3 rounded-full w-fit mb-4">
            <KeyRound className="h-8 w-8 text-brand-primary" />
          </div>
          <CardTitle className="text-[32px] font-bold text-brand-primary">Reset Password</CardTitle>
          <CardDescription className="text-[16px] text-gray-500 font-normal">
            Enter your new secure password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pass" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  id="pass" 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  id="confirm" 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
            <Button 
              type="submit"
              disabled={isLoading || !newPassword}
              className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20 mt-4"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
