"use client";

import { ProductCardHorizontal } from "./components/ProductCardHorizontal";
import { ProductCardVertical } from "./components/ProductCardVertical";
import { Product } from "@/lib/products";

export interface ProductBoxProps {
  id?: string;
  _id?: string;
  productId?: string;
  uuid?: string;
  href: string;
  imageSrc: string;
  name: string;
  price: number;
  description: string;
  shortDescription?: string;
  color?: string;
  layout?: "vertical" | "horizontal";
  dimensions?: string;
  print?: string;
  paper?: string;
  delivery?: string;
  slug?: string;
  priority?: boolean;
}

const ProductBox = ({
  id,
  _id,
  productId,
  uuid,
  href,
  imageSrc,
  name,
  price,
  description,
  shortDescription,
  color,
  layout = "vertical",
  dimensions,
  print,
  paper,
  delivery,
  slug,
  priority = false,
}: ProductBoxProps) => {
  // Construct product object for children
  const product: Product = {
    id: id || _id || productId || uuid,
    slug: slug || "",
    name,
    price,
    image: imageSrc,
    description,
    shortDescription: shortDescription || "",
    dimensions: dimensions || "",
    print: print || "",
    paper: paper || "",
    delivery: delivery || "",
    category: "",
    color,
  };

  if (layout === "horizontal") {
    return <ProductCardHorizontal product={product} href={href} priority={priority} />;
  }

  return <ProductCardVertical product={product} href={href} priority={priority} />;
};

export default ProductBox;
