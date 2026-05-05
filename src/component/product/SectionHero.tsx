import type { ReactNode } from "react";

interface SectionHeroProps {
  backgroundImage: string;
  heading: string;
  description?: string;
  priceRange?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHero({
  backgroundImage,
  heading,
  description,
  priceRange,
  children,
  className = "",
}: SectionHeroProps) {
  return (
    <section
      className={`product-hero product-hero-wave relative flex min-h-[400px] items-center overflow-hidden bg-cover bg-center px-4 pb-[140px] pt-[120px] ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container max-w-6xl px-4 md:px-0 relative z-10 mx-auto">
        <div className="max-w-3xl">
          <h1 className="portfolio-heading text-[42px] font-bold uppercase leading-none text-white md:text-[60px]">
            {heading}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-[21px] font-light leading-relaxed text-white/90 md:text-[24px]">
              {description}
            </p>
          )}
          {priceRange && (
            <strong className="mt-8 block text-[34px] leading-none text-white md:text-[42px]">
              {priceRange} EUR
            </strong>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
