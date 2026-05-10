import Image from "next/image";
import { useState } from "react";
import placeholderImg from "@/assets/placeholder.svg";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const displayImages = images && images.length > 0 
    ? images 
    : [placeholderImg];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {displayImages.map((src, idx) => (
        <GalleryImage key={idx} src={src} name={name} idx={idx} />
      ))}
    </div>
  );
}

function GalleryImage({ src, name, idx }: { src: string; name: string; idx: number }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="overflow-hidden rounded-2xl transition-all">
      <Image
        src={imgSrc}
        alt={`${name} - Image ${idx + 1}`}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="rounded-2xl object-contain transition-transform duration-500 hover:scale-105"
        priority={idx < 4}
        onError={() => setImgSrc(placeholderImg)}
      />
    </div>
  );
}
