import ProductBox from "@/component/product/ProductBox";
import { SubCategory, Product } from "@/lib/products";

interface ProductGridProps {
  slug: string;
  items: (SubCategory | Product)[];
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
        {items.map((item) => (
          <ProductBox
            key={`${item.name}-${item.image}`}
            href={
              isSubcategoryPage
                ? `/products/${item.slug}`
                : `/products/${slug}/${item.slug}`
            }
            imageSrc={item.image}
            name={item.name}
            price={item.price ?? 0}
            description={item.description ?? ""}
            shortDescription={item.shortDescription}
            color={item.color}
            layout="horizontal"
            dimensions={item.dimensions}
            print={item.print}
            paper={item.paper}
            delivery={item.delivery}
            slug={item.slug}
          />
        ))}
      </div>
    </section>
  );
}
