"use client";

import Image from "next/image";
import Link from "next/link";

interface PhotoGridItem {
  src: string;
  title: string;
}

interface PhotoGridProps {
  photos: PhotoGridItem[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <section className="py-24">
      <div className="container max-w-6xl mx-auto px-4 md:px-0">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="break-inside-avoid group relative overflow-hidden rounded-[4px] shadow-sm"
            >
              <Image
                src={photo.src}
                alt={photo.title}
                width={600}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,var(--color-brand-gradient-start)_0%,var(--color-brand-gradient-stop)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center p-[45px]">
                <h3 className="origin-[0_-100%] translate-x-[50px] rotate-[-75deg] text-center text-[32px] font-semibold leading-[1.25em] text-white opacity-0 transition-all duration-200 delay-[35ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-x-0 group-hover:rotate-0 group-hover:opacity-100">
                  {photo.title}
                </h3>
              </div>

              <Link href="#" className="absolute inset-0 z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
