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
  title: "Marta's Dekoviertel",
  description: "By using our app, you can pick some of your favorite photos and display them using our products! ",
  icons: {
    icon: "/img/build/minilogo1.png",
    shortcut: "/img/build/minilogo1.png",
  },
  openGraph: {
    title: "YoloBook",
    description: "By using our app, you can pick some of your favorite photos and display them using our products! ",
    url: "https://www.yolobook.com",
    siteName: "Marta's Dekoviertel",
    images: [
      {
        url: "https://www.yolobook.com/assets/img/home/header-bg.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YoloBook",
    description: "By using our app, you can pick some of your favorite photos and display them using our products! ",
  },
  other: {
    "google-site-verification": "fTe83cC3PLJ8BWjoWjZWD361_HG2468eQ5J6HG3ceAc",
    "theme-color": "#3ed2a7",
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
