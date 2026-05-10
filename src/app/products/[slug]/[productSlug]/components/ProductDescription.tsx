import { parseMetadata } from "@/lib/utils";

interface ProductDescriptionProps {
  product: any;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const { text } = parseMetadata(product.description || "");
  
  return (
    <div className="mt-24 max-w-4xl">
      <h2 className="text-[44px] font-bold leading-tight text-black">
        {product.name}
      </h2>
      <p className="mt-8 text-[18px] font-light leading-relaxed text-[#797b86] md:text-[21px]">
        {text || product.description}
      </p>
    </div>
  );
}
