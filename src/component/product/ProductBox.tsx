import Link from "next/link";
import Image from "next/image";

interface ProductBoxProps {
  href: string;
  imageSrc: string;
  title: string;
  price: string;
  description: string;
}

const ProductBox = ({
  href,
  imageSrc,
  title,
  price,
  description,
}: ProductBoxProps) => {
  return (
    <Link
      href={href}
      className="fancy-box-classes group block overflow-hidden rounded-[15px] bg-white shadow-[0_30px_50px_rgba(0,0,0,0.05)] transition-shadow duration-[450ms] ease-[cubic-bezier(0.32,0.98,0.37,1)] shad hover:shadow-[0_30px_50px_rgba(0,0,0,0.07)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <div className="p-[1.5em_25px]">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
          <h3 className="text-[24px] font-light leading-[1.15em] text-black  transition-colors">
            {title}
          </h3>
          <div className="text-[24px] md:text-[28px] font-bold text-black whitespace-nowrap">
            {price}{" "}
            <span className="text-[18px] font-normal uppercase">EUR</span>
          </div>
        </div>
        <p className="text-[20px] md:text-[22px] text-brand-secondary font-light leading-[1.5em] group-hover:text-gray-500">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ProductBox;
