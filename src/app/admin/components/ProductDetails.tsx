import { Product } from "@/lib/products";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
            <Image 
              src={product.image} 
              alt={product.name} 
              width={600} 
              height={600} 
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                {product.category}
              </span>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
                product.status === 'inactive' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              )}>
                {product.status || 'active'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-brand-primary">{product.name}</h2>
            <p className="text-2xl font-bold text-gray-900 mt-2">${product.price}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Short Description</h4>
              <p className="text-gray-600 mt-1">{product.shortDescription}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Full Description</h4>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Dimensions</h4>
              <p className="text-gray-900 font-medium">{product.dimensions}</p>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Delivery</h4>
              <p className="text-gray-900 font-medium">{product.delivery}</p>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Print</h4>
              <p className="text-gray-900 font-medium">{product.print}</p>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Paper</h4>
              <p className="text-gray-900 font-medium">{product.paper}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
