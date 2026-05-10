"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import { verifyOtp } from "@/lib/api";
import { toast } from "react-toastify";

function VerifyOtpContent() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please start over.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await verifyOtp(email, code);
      if (response.success) {
        toast.success("OTP verified!");
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
      } else {
        toast.error(response.message || "Invalid OTP code");
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
            <ShieldCheck className="h-8 w-8 text-brand-primary" />
          </div>
          <CardTitle className="text-[32px] font-bold text-brand-primary">Verify OTP</CardTitle>
          <CardDescription className="text-[16px] text-gray-500 font-normal">
            Enter the 6-digit code sent to <br />
            <span className="font-bold text-gray-700">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Verification Code</Label>
              <Input 
                id="code" 
                placeholder="123456" 
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-2xl tracking-[0.5em] h-14 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
              />
            </div>
            <Button 
              type="submit"
              disabled={isLoading || code.length < 6}
              className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20 mt-4"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Verify Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
