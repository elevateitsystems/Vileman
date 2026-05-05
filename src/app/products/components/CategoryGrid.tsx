import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/products";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-0 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products/${category.slug}`}
            className="group block overflow-hidden rounded-[20px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={category.mainImage}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <span className="text-white font-bold uppercase tracking-widest text-[14px]">
                  Explore Collection
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-[24px] font-bold text-black group-hover:text-brand-secondary transition-colors">
                {category.name}
              </h3>
              <p className="mt-2 text-[16px] text-gray-500 font-light line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
