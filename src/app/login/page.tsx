import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary blur-[120px]" />
      </div>

      <Card className="w-full max-w-[450px] z-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pt-8">
          <CardTitle className="text-[32px] font-bold text-brand-primary">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[16px] text-gray-500 font-normal">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[14px] font-bold uppercase tracking-widest text-gray-400"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[14px] font-bold uppercase tracking-widest text-gray-400"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[14px] font-medium text-brand-secondary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
          </div>
          <Button className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20">
            Sign In
          </Button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 border-t border-gray-50 py-6 px-8 mt-4">
          <span className="text-[15px] text-gray-500">
            Don&apos;t have an account?
          </span>
          <Link
            href="/register"
            className="text-[15px] font-bold text-brand-secondary hover:underline"
          >
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
