import SectionHero from "@/component/layout/SectionHero";
import { categories } from "@/lib/products";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { PhotoGrid } from "./components/PhotoGrid";

export default function Home() {
  // Select some featured products from categories
  const mugs = categories.find(c => c.slug === "mugs")?.items?.[0];
  const cloths = categories.find(c => c.slug === "cloth-everyday")?.items?.[0];
  const shirts = categories.find(c => c.slug === "shirts")?.items?.[0];
  const other = categories.find(c => c.slug === "other")?.items?.[0];

  const products = [
    {
      href: "/products/mugs/classic-mug",
      imageSrc: mugs?.image || "/img/build/pics/prod_mugs/p-mug-31.png",
      name: mugs?.name || "Classic Mug",
      price: mugs?.price || 12.99,
      description: mugs?.shortDescription || "A beautiful classic mug.",
      slug: "classic-mug",
    },
    {
      href: "/products/cloth-everyday/kitchen-cloth-1",
      imageSrc: cloths?.image || "/img/build/pics/prod_cloths/ready/p-cloth-1.png",
      name: cloths?.name || "Kitchen Cloth #1",
      price: cloths?.price || 20.99,
      description: cloths?.shortDescription || "Premium cotton kitchen cloth.",
      slug: "kitchen-cloth-1",
    },
    {
      href: "/products/shirts/custom-cotton-shirt",
      imageSrc: shirts?.image || "/img/build/pics/prod_shirts/p-shirt-1.png",
      name: shirts?.name || "Custom Cotton Shirt",
      price: shirts?.price || 24.99,
      description: shirts?.shortDescription || "Design your custom shirt.",
      slug: "custom-cotton-shirt",
    },
    {
      href: "/products/other/gift-tissue-box",
      imageSrc: other?.image || "/img/build/pics/misc/tissue-1.png",
      name: other?.name || "Gift Tissue Box",
      price: other?.price || 9.99,
      description: other?.shortDescription || "Decorative tissue box.",
      slug: "gift-tissue-box",
    },
  ];

  const photoGrid = [
    { src: "/img/build/pics/easter/easter1.png", title: "Happy Easter" },
    {
      src: "/img/build/pics/prod_cloths/p-cloth-7.png",
      title: "Kitchen cloth",
    },
    { src: "/img/build/pics/prod_mugs/p-mug-31.png", title: "Oh Deer mug" },
    { src: "/img/build/pics/balloon/balloon1.png", title: "Balloon gift" },
    { src: "/img/build/pics/prod_mugs/p-mug-4.png", title: "Funny mug" },
    { src: "/img/build/pics/misc/tissue-1.png", title: "Tissue" },
  ];

  return (
    <div className="flex flex-col">
      {/* Home Hero - No background image for EN version as per original en.html */}
      <SectionHero
        title="Fo oldal cime"
        description={
          <>
            <p>Rovid bemutatkozo szoveg vagy hasonlo</p>
            <p>
              Ahol megprobalod felhivni az emberek figyelmet erre a{" "}
              <strong className="text-black font-semibold">
                csodalatos weblapra
              </strong>{" "}
              ami ezmellett meg fantasztikus is.
            </p>
            <p>
              Ez lesz a legjobb weblap{" "}
              <strong className="text-black font-semibold">
                10 ev mulva is!
              </strong>
            </p>
          </>
        }
        roundedBottom={false}
        className="pt-20 pb-16"
      />

      <FeaturedProducts products={products} />

      <PhotoGrid photos={photoGrid} />
    </div>
  );
}
