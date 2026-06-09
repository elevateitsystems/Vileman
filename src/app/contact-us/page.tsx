"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/component/icons";
import SectionHero from "@/component/layout/SectionHero";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        toast.error(
          result.error || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SectionHero
        title="Contact us"
        description="If you haven't found an answer to your question yet or wish to send us your feedback, drop us a message using the form below!"
        bgImage="/img/contact/contact-bg.jpg"
        className="text-white"
      />

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <Card className="shadow-xl border-none">
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="rounded-full bg-pink-50 p-5 text-pink-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500">
                    Thanks for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="mt-4 border-pink-200 text-pink-500 hover:bg-pink-50"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="rounded-lg px-6 h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="rounded-lg px-6 h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      className="rounded-lg px-6 py-4 min-h-[150px]"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-lg bg-pink-500 hover:bg-pink-600 text-lg uppercase font-semibold disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Social & Contact Info — unchanged */}
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold italic text-gray-900 leading-tight">
              Follow us on social media
            </h2>
            <div className="space-y-4">
              <a
                href="mailto:nomiweinviertel@gmail.com"
                className="flex items-center justify-center lg:justify-start gap-3 text-xl text-gray-600 hover:text-pink-500 transition-colors"
              >
                <Mail className="h-6 w-6" />
                nomiweinviertel@gmail.com
              </a>
            </div>
            <div className="flex justify-center lg:justify-start gap-6 pt-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61583126521191"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-white shadow-md hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Facebook className="h-8 w-8" />
              </Link>
              <Link
                href="https://www.instagram.com/martasdekoviertel"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-white shadow-md hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Instagram className="h-8 w-8" />
              </Link>
              <Link
                href="#"
                className="p-4 rounded-lg bg-white shadow-md hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Youtube className="h-8 w-8" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
