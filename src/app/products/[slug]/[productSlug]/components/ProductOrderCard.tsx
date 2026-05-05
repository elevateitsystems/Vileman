import { ProductInfo } from "@/component/product/ProductInfo";
import { Product } from "@/lib/products";
import { FileText, Maximize, Printer, Truck } from "lucide-react";

interface ProductOrderCardProps {
  product: Product;
}

export function ProductOrderCard({ product }: ProductOrderCardProps) {
  return (
    <aside className="h-fit sticky top-24 rounded-[20px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] md:p-10">
      <div className="mb-10 flex items-start justify-between gap-4">
        <h3 className="text-[18px] font-medium text-gray-400">
          {product.name}
        </h3>
        <strong className="text-[32px] font-bold text-black">
          {product.price.toFixed(2)} EUR
        </strong>
      </div>

      <p className="my-5 text-[18px] font-light leading-relaxed text-[#797b86] md:text-[21px]">
        {product?.description}
      </p>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
        <ProductInfo
          icon={<Maximize />}
          label="DIMENSIONS"
          value={product.dimensions}
        />
        <ProductInfo icon={<Printer />} label="PRINT" value={product.print} />
        <ProductInfo icon={<FileText />} label="PAPER" value={product.paper} />
        <ProductInfo
          icon={<Truck />}
          label="DELIVERY"
          value={product.delivery}
        />
      </div>

      <button className="mt-14 h-14 w-full rounded-full bg-[#2e4857] text-[16px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black">
        ORDER
      </button>
    </aside>
  );
}
