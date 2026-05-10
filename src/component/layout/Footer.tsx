"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Facebook, Instagram, Youtube, Visa, Mastercard, Maestro, Jcb, Discover } from "../icons";
import { fetchCategories, fetchSubCategories } from "@/lib/api";

const Footer = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const [categoriesData, subCategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSubCategories()
        ]);
        
        // Show only top-level categories (no parent category)
        const topLevel = categoriesData.filter((cat: any) => !cat.categoryId);
        
        setCategories(topLevel);
      } catch (error) {
        console.error("Failed to load footer categories:", error);
      }
    }
    loadCategories();
  }, []);

  return (
    <footer className="main-footer bg-[url('/img/misc/doodles1.png')] bg-cover bg-center bg-no-repeat pt-[60px] pb-12 font-futura text-white">
      <div className="container max-w-6xl mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Website Links */}
          <div className="hidden md:block">
            <h3 className="mb-[1.35em] text-[18px] font-bold uppercase text-white">
              Website
            </h3>
            <ul className="space-y-3 text-[15px] text-white/85">
              <li>
                <Link href="/" className="hover:text-white hover:opacity-100">
                  Home page
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white hover:opacity-100"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white hover:opacity-100"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Products - Dynamic */}
          <div>
            <h3 className="mb-[1.35em] text-[18px] font-bold uppercase text-white">
              Our products
            </h3>
            <ul className="space-y-3 text-[15px] text-white/85">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="hover:text-white hover:opacity-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Payment */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="mb-[1.35em] text-[18px] font-bold uppercase text-white">
                  Contact us
                </h3>
                <ul className="space-y-6 text-[15px] text-white/85">
                  <li>
                    <a
                      href="mailto:nomiweinviertel@gmail.com"
                      className="flex items-center justify-center gap-3 hover:text-white md:justify-start"
                    >
                      <Mail className="h-5 w-5 text-white" />
                      nomiweinviertel@gmail.com
                    </a>
                  </li>
                </ul>

                <h4 className="mt-10 mb-4 text-[15px] font-normal text-white">
                  Payment methods
                </h4>
                <div className="flex flex-wrap justify-center gap-4 text-brand-primary md:justify-start">
                  <div className="rounded border border-white bg-white p-2 shadow-sm">
                    <Visa className="h-6 w-10" />
                  </div>
                  <div className="rounded border border-white bg-white p-2 shadow-sm">
                    <Mastercard className="h-6 w-10" />
                  </div>
                  <div className="rounded border border-white bg-white p-2 shadow-sm">
                    <Maestro className="h-6 w-10" />
                  </div>
                  <div className="rounded border border-white bg-white p-2 shadow-sm">
                    <Jcb className="h-6 w-10" />
                  </div>
                  <div className="rounded border border-white bg-white p-2 shadow-sm">
                    <Discover className="h-6 w-10" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-[1.35em] text-[18px] font-bold uppercase text-white">
                  Follow us
                </h3>
                <div className="flex justify-center md:justify-start gap-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=61583126521191"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-[45px] items-center justify-center rounded-full border-2 border-white bg-white text-brand-primary transition-all duration-500 hover:bg-brand-primary hover:text-white"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/martasdekoviertel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-[45px] items-center justify-center rounded-full border-2 border-white bg-white text-brand-primary transition-all duration-500 hover:bg-brand-primary hover:text-white"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="flex size-[45px] items-center justify-center rounded-full border-2 border-white bg-white text-brand-primary transition-all duration-500 hover:bg-brand-primary hover:text-white"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 text-center">
          <div className="mb-10 flex justify-center">
            <Image
              src="/img/build/logo1-w1.png"
              alt="Marta's Dekoviertel"
              width={160}
              height={45}
              className="opacity-100"
            />
          </div>
          <p className="text-[15px] font-normal text-white/85">
            © 2026 Huszta technology | made by Viktor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
