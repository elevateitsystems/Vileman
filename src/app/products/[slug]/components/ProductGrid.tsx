import ProductBox from "@/component/product/ProductBox";
import { parseMetadata } from "@/lib/utils";
import placeholderImg from "@/assets/placeholder.svg";

interface ProductGridProps {
  slug: string;
  items: any[];
  isSubcategoryPage: boolean;
}

export function ProductGrid({
  slug,
  items,
  isSubcategoryPage,
}: ProductGridProps) {
  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-0 pb-24 pt-16">
      <div className="grid grid-cols-1 gap-16">
        {items.map((item) => {
          const { text, metadata } = parseMetadata(item.description || "");
          const images = item.images || [];
          const imageSrc = images.length > 0 
            ? (typeof images[0] === 'string' ? images[0] : images[0].url)
            : (metadata.image || item.image || placeholderImg);
          
          return (
            <ProductBox
              key={item.id || item.slug}
              id={item.id}
              _id={item._id}
              productId={item.productId}
              uuid={item.uuid}
              href={
                isSubcategoryPage
                  ? `/products/${item.slug}`
                  : `/products/${slug}/${item.slug}`
              }
              imageSrc={imageSrc}
              name={item.name}
              price={parseFloat(item.price) || 0}
              description={text || item.description}
              shortDescription={metadata.shortDescription || item.shortDescription}
              color={item.color || metadata.color}
              layout="horizontal"
              dimensions={metadata.dimensions}
              print={metadata.print}
              paper={metadata.paper}
              slug={item.slug}
            />
          );
        })}
      </div>
    </section>
  );
}
