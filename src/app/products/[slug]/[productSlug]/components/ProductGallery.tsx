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

  // Determine grid layout based on number of images
  const getGridClass = () => {
    const count = displayImages.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count >= 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";
    return "grid-cols-1";
  };

  // Determine if image should be featured (larger)
  const isFeatured = (index: number) => {
    if (displayImages.length === 1) return true;
    if (displayImages.length === 2) return true;
    if (displayImages.length >= 3 && index === 0) return true;
    return false;
  };

  return (
    <div className={`grid gap-4 md:gap-6 ${getGridClass()}`}>
      {displayImages.map((src, idx) => (
        <GalleryImage 
          key={idx} 
          src={src} 
          name={name} 
          idx={idx} 
          isFeatured={isFeatured(idx)}
          totalImages={displayImages.length}
        />
      ))}
    </div>
  );
}

function GalleryImage({ 
  src, 
  name, 
  idx, 
  isFeatured,
  totalImages 
}: { 
  src: string; 
  name: string; 
  idx: number;
  isFeatured: boolean;
  totalImages: number;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  // Different sizing based on featured status
  const getImageDimensions = () => {
    if (isFeatured) {
      return {
        aspect: "aspect-[4/3]",
        width: 800,
        height: 600,
        className: "rounded-2xl"
      };
    }
    return {
      aspect: "aspect-square",
      width: 400,
      height: 400,
      className: "rounded-xl"
    };
  };

  const dimensions = getImageDimensions();

  // For 3+ images, make the first one span both columns
  const getSpanClass = () => {
    if (totalImages >= 3 && idx === 0) {
      return "sm:col-span-2";
    }
    return "";
  };

  return (
    <div className={`overflow-hidden transition-all ${dimensions.aspect} ${getSpanClass()} relative group`}>
      <Image
        src={imgSrc}
        alt={`${name} - Image ${idx + 1}`}
        width={dimensions.width}
        height={dimensions.height}
        className={`object-contain transition-transform duration-500 group-hover:scale-105 ${dimensions.className}`}
        priority={idx < 4}
        onError={() => setImgSrc(placeholderImg)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Image counter badge for multiple images */}
      {totalImages > 1 && (
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {idx + 1} / {totalImages}
        </div>
      )}
    </div>
  );
}