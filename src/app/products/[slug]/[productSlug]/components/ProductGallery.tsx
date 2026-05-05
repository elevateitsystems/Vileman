import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductGalleryProps {
  items: Product[];
}

export function ProductGallery({ items }: ProductGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {(items || []).map((item, idx) => (
        <div key={idx} className="">
          <div className="relative w-full">
            <Image
              src={item.image}
              alt={item.name}
              width={400}
              height={300}
              className="w-full h-auto block"
              priority={idx < 6}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
