import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, ShieldCheck } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary blur-[120px]" />
      </div>

      <Card className="w-full max-w-[500px] z-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pt-8">
          <CardTitle className="text-[32px] font-bold text-brand-primary">Create Account</CardTitle>
          <CardDescription className="text-[16px] text-gray-500 font-normal">
            Join Marta&apos;s Dekoviertel and start creating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  id="firstName" 
                  placeholder="Marta" 
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  id="lastName" 
                  placeholder="Dekoviertel" 
                  className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
          </div>
          
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Confirm Password</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••"
                className="pl-10 h-12 border-gray-100 focus:border-brand-primary focus:ring-brand-primary/20 transition-all rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary transition-all cursor-pointer"
            />
            <label htmlFor="terms" className="text-[14px] text-gray-500 cursor-pointer">
              I agree to the <Link href="/terms" className="text-brand-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand-primary font-bold hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <Button className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20">
            Create Account
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 border-t border-gray-50 py-6 px-8 mt-4">
          <span className="text-[15px] text-gray-500">Already have an account?</span>
          <Link
            href="/login"
            className="text-[15px] font-bold text-brand-secondary hover:underline"
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
