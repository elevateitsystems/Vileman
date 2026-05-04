export interface ProductItem {
  title: string
  description: string
  price: string
  image: string
  href?: string
}

export interface ProductCategory {
  slug: string
  title: string
  heading: string
  description: string
  heroClass: "prod-mugs" | "prod-cloths"
  heroImage: string
  mainImage: string
  price: string
  ctaHref: string
  gallery: string[]
  items?: ProductItem[]
  subcategories?: ProductItem[]
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
].map((name) => `/img/build/pics/prod_cloths/ready/${name}.png`)

const easter = Array.from(
  { length: 12 },
  (_, index) => `/img/build/pics/easter/easter${index + 1}.png`
)

export const categories: ProductCategory[] = [
  {
    slug: "mugs",
    title: "Custom Mugs",
    heading: "Termek #1",
    description: "Rovid termekleiras",
    heroClass: "prod-mugs",
    heroImage: "/img/build/pics/misc/bg4.png",
    mainImage: "/img/build/pics/index/index_mug1.png",
    price: "0.99",
    ctaHref: "https://onelink.to/yolobook",
    gallery: [
      "/img/build/pics/prod_mugs/p-mug-31.png",
      "/img/build/pics/prod_mugs/p-mug-4.png",
      "/img/build/pics/prod_mugs/p-mug-8.png",
      "/img/build/pics/prod_mugs/p-mug-12.png",
      "/img/build/pics/prod_mugs/p-mug-18.png",
    ],
  },
  {
    slug: "shirts",
    title: "Custom shirts",
    heading: "Termek #1",
    description: "Rovid termekleiras",
    heroClass: "prod-mugs",
    heroImage: "/img/build/pics/misc/bg4.png",
    mainImage: "/img/build/pics/index/index_shirt.png",
    price: "0.99",
    ctaHref: "https://onelink.to/yolobook",
    gallery: [
      "/img/build/pics/prod_shirts/p-shirt-1.png",
      "/img/build/pics/prod_shirts/p-shirt-2.png",
      "/img/build/pics/prod_shirts/p-shirt-3.png",
      "/img/build/pics/prod_shirts/p-shirt-4.png",
      "/img/build/pics/prod_shirts/p-shirt-5.png",
    ],
  },
  {
    slug: "other",
    title: "Other gifts",
    heading: "Termek #1",
    description: "Rovid termekleiras",
    heroClass: "prod-mugs",
    heroImage: "/img/build/pics/misc/bg.png",
    mainImage: "/img/build/pics/misc/tissue-1.png",
    price: "0.99",
    ctaHref: "https://onelink.to/yolobook",
    gallery: [
      "/img/build/pics/misc/tissue-1.png",
      "/img/build/pics/misc/p-mug-11.png",
      "/img/build/pics/misc/p-mug-13.png",
      "/img/build/pics/misc/p-mug-18.png",
    ],
  },
  {
    slug: "cloth-menu",
    title: "Kitchen Cloths Menu",
    heading: "Kitchen Cloths Menu",
    description: "Pick your favorite tablecloth.",
    heroClass: "prod-cloths",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: "/img/build/pics/index/index_cloth1.png",
    price: "20.99",
    ctaHref: "/products/cloth-everyday",
    gallery: clothReady.slice(0, 3),
    subcategories: [
      {
        title: "Kitchen Cloths Everyday",
        description: "Everyday kitchen cloths.",
        price: "20.99",
        image: clothReady[0],
        href: "/products/cloth-everyday",
      },
      {
        title: "Kitchen Cloths Easter",
        description: "Easter kitchen cloths.",
        price: "20.99",
        image: easter[0],
        href: "/products/cloth-easter",
      },
      {
        title: "Kitchen Cloths Christmas",
        description: "Christmas kitchen cloths.",
        price: "20.99",
        image: clothReady[2],
        href: "/products/cloth-christmas",
      },
    ],
  },
  {
    slug: "cloth-everyday",
    title: "Kitchen Cloths Everyday",
    heading: "Kitchen Cloths Everyday",
    description: "Everyday kitchen cloths.",
    heroClass: "prod-cloths",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: clothReady[0],
    price: "20.99",
    ctaHref: "https://onelink.to/yolobook",
    gallery: clothReady,
    items: clothReady.map((image, index) => ({
      title: `Kitchen Cloth #${index + 1}`,
      description: "Kitchen cloth",
      price: "20.99",
      image,
    })),
  },
  {
    slug: "cloth-easter",
    title: "Kitchen Cloths Easter",
    heading: "Kitchen Cloths Easter",
    description: "Easter kitchen cloths.",
    heroClass: "prod-cloths",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: easter[0],
    price: "20.99",
    ctaHref: "https://onelink.to/yolobook",
    gallery: easter,
    items: easter.map((image, index) => ({
      title: `Easter Cloth #${index + 1}`,
      description: "Kitchen cloth",
      price: "20.99",
      image,
    })),
  },
  {
    slug: "cloth-christmas",
    title: "Kitchen Cloths Christmas",
    heading: "Kitchen Cloths Christmas",
    description: "Christmas kitchen cloths.",
    heroClass: "prod-cloths",
    heroImage: "/img/build/pics/misc/bgcl1.png",
    mainImage: clothReady[2],
    price: "20.99",
    ctaHref: "https://onelink.to/yolobook",
    gallery: clothReady,
    items: clothReady.map((image, index) => ({
      title: `Christmas Cloth #${index + 1}`,
      description: "Kitchen cloth",
      price: "20.99",
      image,
    })),
  },
]

export function getProductBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export const products = categories
