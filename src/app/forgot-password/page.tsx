import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Send } from "lucide-react"

export default function ForgotPasswordPage() {
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
        <CardContent className="space-y-6 px-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
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
          <Button className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20">
            Reset Password
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t border-gray-50 py-6 px-8 mt-4">
          <Link
            href="/login"
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
