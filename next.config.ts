import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.166",
      },
      {
        protocol: "https",
        hostname: "vileman-backend.onrender.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/en.html", destination: "/", permanent: true },
      { source: "/en/index.html", destination: "/", permanent: true },
      { source: "/en/contact-us.html", destination: "/contact-us", permanent: true },
      { source: "/en/prod_mug.html", destination: "/products/mugs", permanent: true },
      { source: "/en/prod_shirt.html", destination: "/products/shirts", permanent: true },
      { source: "/en/prod_misc.html", destination: "/products/other", permanent: true },
      { source: "/en/prod_cloth_menu.html", destination: "/products/cloth-menu", permanent: true },
      { source: "/en/prod_cloth_evd.html", destination: "/products/cloth-everyday", permanent: true },
      { source: "/en/prod_cloth_easter.html", destination: "/products/cloth-easter", permanent: true },
      { source: "/en/prod_cloth_chrstms.html", destination: "/products/cloth-christmas", permanent: true },
      { source: "/en/prod_balloon.html", destination: "/products/other", permanent: true },
      { source: "/en/yolobox.html", destination: "/products/other", permanent: true },
      { source: "/en/yolobook-mini.html", destination: "/products/mugs", permanent: true },
      { source: "/en/products.html", destination: "/#nasi_proizvodi", permanent: true },
      { source: "/en/photo-albums.html", destination: "/#nasi_proizvodi", permanent: true },
    ]
  },
};

export default nextConfig;
