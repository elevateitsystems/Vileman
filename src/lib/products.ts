export interface Product {
  slug: string;
  name: string;
  price: number;
  delivery: string;
  shortDescription: string;
  description: string;
  dimensions: string;
  print: string;
  paper: string;
  image: string;
  images?: string[];
  category: string; // Explicit relation with category slug
  color?: string;
  quantity?: number;
  status?: 'active' | 'inactive';
}

export interface SubCategory {
  name: string;
  slug: string;
  image: string;
  description?: string;
  price?: number;
  shortDescription?: string;
  color?: string;
  dimensions?: string;
  print?: string;
  paper?: string;
  delivery?: string;
}

export interface Category {
  slug: string;
  name: string;
  heading: string;
  subcategory?: SubCategory[];
  items?: Product[];
  heroImage: string;
  mainImage: string;
  description: string;
  priceRange?: string;
  gallery: string[];
  ctaHref: string;
}

const clothReady = [
  "p-cloth-1",
  "p-cloth-3",
  "p-cloth-4",
  "p-cloth-7",
  "p-cloth-8",
  "p-cloth-9",
  "p-cloth-11",
  "p-cloth-12",
  "p-cloth-15",
  "p-cloth-16",
  "p-cloth-18",
  "p-cloth-19",
].map((name) => `/img/build/pics/prod_cloths/ready/${name}.png`);

const easter = Array.from(
  { length: 12 },
  (_, index) => `/img/build/pics/easter/easter${index + 1}.png`,
);

export const categories: Category[] = [
  {
    slug: "cloth-menu",
    name: "Kitchen Cloths",
    heading: "Premium Kitchen Linens",
    description: "Pick your favorite tablecloth from our collection.",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: "/img/build/pics/index/index_cloth1.png",
    gallery: clothReady.slice(0, 4),
    ctaHref: "/products/cloth-everyday",
    subcategory: [
      {
        name: "Kitchen Cloths Everyday",
        slug: "cloth-everyday",
        image: clothReady[0],
        description: "Premium cotton kitchen cloths for everyday use.",
        price: 20.99,
        delivery: "5-9 days",
      },
      {
        name: "Kitchen Cloths Easter",
        slug: "cloth-easter",
        image: easter[0],
        description: "Festive Easter themed kitchen cloths.",
        price: 20.99,
        delivery: "5-9 days",
      },
      {
        name: "Kitchen Cloths Christmas",
        slug: "cloth-christmas",
        image: clothReady[2],
        description: "Holiday themed kitchen cloths for your Christmas kitchen.",
        price: 20.99,
        delivery: "5-9 days",
      },
    ],
  },
  {
    slug: "cloth-everyday",
    name: "Kitchen Cloths Everyday",
    heading: "Everyday Kitchen Essentials",
    description: "Premium cotton kitchen cloths for everyday use.",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: clothReady[0],
    gallery: clothReady.slice(0, 6),
    ctaHref: "/products/cloth-everyday/kitchen-cloth-1",
    items: clothReady.map((image, index) => ({
      slug: `kitchen-cloth-${index + 1}`,
      name: `Kitchen Cloth #${index + 1}`,
      price: 20.99,
      delivery: "5-9 days",
      shortDescription: "Premium cotton kitchen cloth for everyday use.",
      description:
        "Our everyday kitchen cloths are highly absorbent and durable. Made from 100% natural cotton with reinforced edges to prevent fraying.",
      dimensions: "50 x 70 cm",
      print: "Screen Printed",
      paper: "N/A",
      image,
      category: "cloth-everyday",
      color: "Standard",
      quantity: 100,
    })),
  },
  {
    slug: "cloth-easter",
    name: "Kitchen Cloths Easter",
    heading: "Easter Celebration Collection",
    description: "Festive Easter themed kitchen cloths.",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: easter[0],
    gallery: easter.slice(0, 6),
    ctaHref: "/products/cloth-easter/easter-cloth-1",
    items: easter.map((image, index) => ({
      slug: `easter-cloth-${index + 1}`,
      name: `Easter Cloth #${index + 1}`,
      price: 20.99,
      delivery: "5-9 days",
      shortDescription: "Festive Easter themed kitchen cloth.",
      description:
        "Bring the joy of Easter to your kitchen with our festive collection. Features cute bunny and egg designs in vibrant spring colors.",
      dimensions: "50 x 70 cm",
      print: "Screen Printed",
      paper: "N/A",
      image,
      category: "cloth-easter",
      color: "Easter Print",
      quantity: 50,
    })),
  },
  {
    slug: "cloth-christmas",
    name: "Kitchen Cloths Christmas",
    heading: "Holiday Magic Collection",
    description: "Holiday themed kitchen cloths for your Christmas kitchen.",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: clothReady[2],
    gallery: clothReady.slice(2, 8),
    ctaHref: "/products/cloth-christmas/christmas-cloth-1",
    items: clothReady.map((image, index) => ({
      slug: `christmas-cloth-${index + 1}`,
      name: `Christmas Cloth #${index + 1}`,
      price: 20.99,
      delivery: "5-9 days",
      shortDescription:
        "Holiday themed kitchen cloth for your Christmas kitchen.",
      description:
        "Warm up your holiday kitchen with these beautiful Christmas cloths. Durable, festive, and perfect for all your holiday baking needs.",
      dimensions: "50 x 70 cm",
      print: "Screen Printed",
      paper: "N/A",
      image,
      category: "cloth-christmas",
      color: "Christmas Red",
      quantity: 50,
    })),
  },
  {
    slug: "mugs",
    name: "Custom Mugs",
    heading: "Build Your Perfect Mug",
    description: "Design your own custom mugs with beautiful prints.",
    heroImage: "/img/build/pics/misc/bg4.png",
    mainImage: "/img/build/pics/index/index_mug1.png",
    gallery: [
      "/img/build/pics/prod_mugs/p-mug-31.png",
      "/img/build/pics/prod_mugs/p-mug-4.png",
      "/img/build/pics/prod_mugs/p-mug-8.png",
      "/img/build/pics/prod_mugs/p-mug-12.png",
    ],
    ctaHref: "/products/mugs/classic-mug",
    items: [
      {
        slug: "classic-mug",
        name: "Classic Mug",
        price: 12.99,
        delivery: "3-5 days",
        shortDescription: "A beautiful classic mug for your daily coffee.",
        description:
          "This premium ceramic mug is perfect for coffee, tea, or cocoa. It's durable, microwave safe, and features a high-quality print that won't fade.",
        dimensions: "9.5cm height, 8cm diameter",
        print: "Sublimation",
        paper: "N/A",
        image: "/img/build/pics/prod_mugs/p-mug-31.png",
        category: "mugs",
        color: "White",
        quantity: 50,
      },
      {
        slug: "funny-deer-mug",
        name: "Funny Deer Mug",
        price: 14.99,
        delivery: "3-5 days",
        shortDescription: "Start your day with a smile and this deer mug.",
        description:
          "A whimsical deer design wraps around this high-quality mug. Perfect for nature lovers and those who appreciate a bit of humor with their morning brew.",
        dimensions: "9.5cm height, 8cm diameter",
        print: "Sublimation",
        paper: "N/A",
        image: "/img/build/pics/prod_mugs/p-mug-4.png",
        category: "mugs",
        color: "Custom Print",
        quantity: 30,
      },
    ],
  },
  {
    slug: "shirts",
    name: "Custom Shirts",
    heading: "Wear Your Design",
    description: "High-quality cotton shirts with your unique designs.",
    heroImage: "/img/build/pics/misc/bg4.png",
    mainImage: "/img/build/pics/index/index_shirt.png",
    gallery: [
      "/img/build/pics/prod_shirts/p-shirt-1.png",
      "/img/build/pics/prod_shirts/p-shirt-2.png",
      "/img/build/pics/prod_shirts/p-shirt-3.png",
    ],
    ctaHref: "/products/shirts/custom-cotton-shirt",
    items: [
      {
        slug: "custom-cotton-shirt",
        name: "Custom Cotton Shirt",
        price: 24.99,
        delivery: "5-7 days",
        shortDescription: "High quality cotton shirt with your own design.",
        description:
          "Made from 100% organic cotton, this shirt is soft, breathable, and provides the perfect canvas for your custom artwork or photos.",
        dimensions: "S, M, L, XL, XXL",
        print: "DTG (Direct to Garment)",
        paper: "N/A",
        image: "/img/build/pics/prod_shirts/p-shirt-1.png",
        category: "shirts",
        color: "Black",
        quantity: 40,
      },
      {
        slug: "premium-v-neck",
        name: "Premium V-Neck",
        price: 29.99,
        delivery: "5-7 days",
        shortDescription: "Elegant v-neck shirt for any occasion.",
        description:
          "A sophisticated v-neck cut combined with premium fabric. Durable, stylish, and comfortable for all-day wear.",
        dimensions: "S, M, L, XL",
        print: "DTG",
        paper: "N/A",
        image: "/img/build/pics/prod_shirts/p-shirt-2.png",
        category: "shirts",
        color: "Grey",
        quantity: 25,
      },
    ],
  },
  {
    slug: "other",
    name: "Other Gifts",
    heading: "Unique Gifts for Everyone",
    description: "Unique gift items for your loved ones.",
    heroImage: "/img/build/pics/misc/bg.png",
    mainImage: "/img/build/pics/misc/tissue-1.png",
    gallery: [
      "/img/build/pics/misc/tissue-1.png",
      "/img/build/pics/misc/p-mug-11.png",
    ],
    ctaHref: "/products/other/gift-tissue-box",
    items: [
      {
        slug: "gift-tissue-box",
        name: "Gift Tissue Box",
        price: 9.99,
        delivery: "2-4 days",
        shortDescription: "Decorative tissue box for special gifts.",
        description:
          "A beautifully crafted wooden tissue box with hand-painted details. Adds a touch of elegance to any room.",
        dimensions: "25 x 13 x 9 cm",
        print: "Hand-painted",
        paper: "N/A",
        image: "/img/build/pics/misc/tissue-1.png",
        category: "other",
        color: "Floral",
        quantity: 100,
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

// All possible slugs for the [slug] route (categories and products)
export const allSlugs = [
  ...categories.map((c) => ({ slug: c.slug })),
  ...categories.flatMap((c) => (c.items || []).map((i) => ({ slug: i.slug }))),
];

export const products = categories.flatMap((c) => c.items || []);
