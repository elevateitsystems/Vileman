"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Send, Loader2 } from "lucide-react";
import { forgotPassword } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        toast.success(response.message || "Reset code sent to your email!");
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(response.message || "Failed to send reset instructions");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-brand-primary blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-secondary blur-[100px]" />
      </div>

      <Card className="w-full max-w-[450px] z-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="mx-auto bg-brand-primary/10 p-3 rounded-full w-fit mb-4">
            <Send className="h-8 w-8 text-brand-primary" />
          </div>
          <CardTitle className="text-[32px] font-bold text-brand-primary">Forgot Password?</CardTitle>
          <CardDescription className="text-[16px] text-gray-500 font-normal">
            No worries, we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t border-gray-50 py-6 px-8 mt-4">
          <Link
            href="/auth/login"
            className="group flex items-center gap-2 text-[15px] font-bold text-gray-500 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
