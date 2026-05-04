"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Facebook, Instagram, Youtube } from "@/component/icons"
import SectionHero from "@/component/layout/SectionHero"

export default function ContactUs() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <SectionHero 
        title="Contact us"
        description="If you haven’t found an answer to your question yet or wish to send us your feedback, drop us a message using the form below!"
        bgImage="/img/contact/contact-bg.jpg"
        className="text-white"
      />

      {/* Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Form Card */}
          <Card className="shadow-xl border-none">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" placeholder="Your name" className="rounded-full px-6 h-12" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Email Address" className="rounded-full px-6 h-12" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Message" className="rounded-3xl px-6 py-4 min-h-[150px]" required />
                </div>
                <Button type="submit" className="w-full h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-lg uppercase font-semibold">
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social & Contact Info */}
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold italic text-gray-900 leading-tight">
              Follow us on social media
            </h2>
            <div className="space-y-4">
              <a href="mailto:nomiweinviertel@gmail.com" className="flex items-center justify-center lg:justify-start gap-3 text-xl text-gray-600 hover:text-pink-500 transition-colors">
                <Mail className="h-6 w-6" />
                nomiweinviertel@gmail.com
              </a>
            </div>
            <div className="flex justify-center lg:justify-start gap-6 pt-4">
              <a href="https://www.facebook.com/profile.php?id=61583126521191" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white shadow-md hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook className="h-8 w-8" />
              </a>
              <a href="https://www.instagram.com/martasdekoviertel" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white shadow-md hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram className="h-8 w-8" />
              </a>
              <a href="#" className="p-4 rounded-full bg-white shadow-md hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Youtube className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
