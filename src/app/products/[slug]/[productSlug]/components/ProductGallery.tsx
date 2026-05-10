import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const displayImages = images && images.length > 0 
    ? images 
    : ["/img/build/pics/prod_mugs/p-mug-31.png"];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {displayImages.map((src, idx) => (
        <div key={idx} className="overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="relative w-full aspect-[4/5] sm:aspect-square">
            <Image
              src={src}
              alt={`${name} - Image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={idx < 4}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
