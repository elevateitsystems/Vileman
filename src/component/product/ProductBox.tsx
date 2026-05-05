import Link from "next/link";
import Image from "next/image";

interface ProductBoxProps {
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
}

const ProductBox = ({
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
}: ProductBoxProps) => {
  if (layout === "horizontal") {
    return (
      <div className="group flex flex-col overflow-hidden sm:flex-row gap-12 ">
        <div className="relative overflow-hidden md:flex-1 rounded-xl">
          <Image
            src={imageSrc}
            alt={name}
            width={600}
            height={800}
            className="object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="text-[28px] font-bold leading-tight text-black md:text-[34px]">
                {name}
              </h3>
              <div className="text-[28px] font-bold text-black md:text-[34px]">
                {price.toFixed(2)}{" "}
                <span className="text-[20px] font-normal uppercase">EUR</span>
              </div>
            </div>

            {color && (
              <p className="text-[14px] font-bold uppercase tracking-widest text-gray-400">
                VARIANT: <span className="text-brand-secondary">{color}</span>
              </p>
            )}

            <p className="text-[18px] font-light leading-relaxed text-[#797b86] md:text-[20px]">
              {shortDescription || description}
            </p>

            {(dimensions || print || paper || delivery) && (
              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
                {dimensions && (
                  <InfoItem label="Dimensions" value={dimensions} />
                )}
                {print && <InfoItem label="Print" value={print} />}
                {paper && <InfoItem label="Paper" value={paper} />}
                {delivery && <InfoItem label="Delivery" value={delivery} />}
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-8">
            <Link href={href} className="w-full">
              <button className="w-full h-12 rounded-full bg-brand-primary px-10 text-[14px] font-bold uppercase tracking-widest text-white transition-all hover:bg-brand-secondary">
                Order
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Original vertical layout
  return (
    <Link
      href={href}
      className="fancy-box-classes group block overflow-hidden rounded-[15px] bg-white shadow-[0_30px_50px_rgba(0,0,0,0.05)] transition-shadow duration-[450ms] ease-[cubic-bezier(0.32,0.98,0.37,1)] shad hover:shadow-[0_30px_50px_rgba(0,0,0,0.07)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          width={600}
          height={800}
          className="object-cover"
        />
      </div>
      <div className="p-[1.5em_25px]">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
          <h3 className="text-[24px] font-light leading-[1.15em] text-black  transition-colors">
            {name}
          </h3>
          <div className="text-[24px] md:text-[28px] font-bold text-black whitespace-nowrap">
            {price.toFixed(2)}{" "}
            <span className="text-[18px] font-normal uppercase">EUR</span>
          </div>
        </div>
        <p className="text-[20px] md:text-[22px] text-brand-secondary font-light leading-[1.5em] group-hover:text-gray-500">
          {shortDescription || description}
        </p>
      </div>
    </Link>
  );
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="text-[16px] font-medium text-black">{value}</div>
    </div>
  );
}

export default ProductBox;
