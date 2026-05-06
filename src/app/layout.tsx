import localFont from "next/font/local";
import "./globle.css";
import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";
import { OrderModal } from "@/component/product/components/OrderModal";

const futuraPT = localFont({
  src: [
    { path: "../../public/fonts/FuturaPTLight.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/FuturaPTBook.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/FuturaPTBold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-futura-pt",
});

const nickainley = localFont({
  src: "../../public/fonts/Nickainley-Normal.otf",
  variable: "--font-nickainley",
});

const phosphate = localFont({
  src: "../../public/fonts/Phosphate.otf",
  variable: "--font-phosphate",
});

const crushine = localFont({
  src: "../../public/fonts/Crushine Brush Script.otf",
  variable: "--font-crushine",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marta's Dekoviertel | Custom Photo Products & Decor",
  description: "Create beautiful custom photo products and home decor. Pick your favorite photos and display them on our premium mugs, cloths, and more.",
  icons: {
    icon: "/img/build/minilogo1.png",
    shortcut: "/img/build/minilogo1.png",
  },
  openGraph: {
    title: "Marta's Dekoviertel | Custom Photo Products",
    description: "Create beautiful custom photo products and home decor. Pick your favorite photos and display them on our premium mugs, cloths, and more.",
    url: "https://martas-dekoviertel.com",
    siteName: "Marta's Dekoviertel",
    images: [
      {
        url: "/img/build/logo1.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marta's Dekoviertel",
    description: "Create beautiful custom photo products and home decor.",
    images: ["/img/build/logo1.png"],
  },
  other: {
    "google-site-verification": "fTe83cC3PLJ8BWjoWjZWD361_HG2468eQ5J6HG3ceAc",
    "theme-color": "#735c92",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${futuraPT.variable} ${nickainley.variable} ${phosphate.variable} ${crushine.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-futura text-[18px] leading-[1.5em]">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <OrderModal />
      </body>
    </html>
  );
}
