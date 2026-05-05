import ProductBox from "@/component/product/ProductBox";
import SectionHero from "@/component/layout/SectionHero";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/products";

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
    },
    {
      href: "/products/cloth-everyday/kitchen-cloth-1",
      imageSrc: cloths?.image || "/img/build/pics/prod_cloths/ready/p-cloth-1.png",
      name: cloths?.name || "Kitchen Cloth #1",
      price: cloths?.price || 20.99,
      description: cloths?.shortDescription || "Premium cotton kitchen cloth.",
    },
    {
      href: "/products/shirts/custom-cotton-shirt",
      imageSrc: shirts?.image || "/img/build/pics/prod_shirts/p-shirt-1.png",
      name: shirts?.name || "Custom Cotton Shirt",
      price: shirts?.price || 24.99,
      description: shirts?.shortDescription || "Design your custom shirt.",
    },
    {
      href: "/products/other/gift-tissue-box",
      imageSrc: other?.image || "/img/build/pics/misc/tissue-1.png",
      name: other?.name || "Gift Tissue Box",
      price: other?.price || 9.99,
      description: other?.shortDescription || "Decorative tissue box.",
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

      {/* Products Section */}
      <section id="nasi_proizvodi" className="bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[30px] font-bold text-black uppercase tracking-widest mb-4">
              Termekek
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => (
              <ProductBox key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Photo Grid Section */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-4 md:px-0">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {photoGrid.map((photo, index) => (
              <div
                key={index}
                className="break-inside-avoid group relative overflow-hidden rounded-[4px] shadow-sm"
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,var(--color-brand-gradient-start)_0%,var(--color-brand-gradient-stop)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center p-[45px]">
                  <h3 className="origin-[0_-100%] translate-x-[50px] rotate-[-75deg] text-center text-[32px] font-semibold leading-[1.25em] text-white opacity-0 transition-all duration-200 delay-[35ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-x-0 group-hover:rotate-0 group-hover:opacity-100">
                    {photo.title}
                  </h3>
                </div>

                <Link href="#" className="absolute inset-0 z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
