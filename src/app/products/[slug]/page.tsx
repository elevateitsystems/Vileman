import ProductBox from "@/component/product/ProductBox"
import { getProductBySlug, products } from "@/lib/products"
import { FileText, Maximize, Printer, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const cards = product.subcategories ?? product.items

  return (
    <div className="product-page flex min-h-screen flex-col">
      <section
        className="product-hero product-hero-wave relative flex min-h-[430px] items-center overflow-hidden bg-cover bg-center px-4 pb-[170px] pt-[150px]"
        style={{ backgroundImage: `url(${product.heroImage})` }}
      >
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl">
            <h1 className="portfolio-heading text-[42px] font-bold uppercase leading-none text-white md:text-[60px]">
              {product.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-[21px] font-light leading-relaxed text-white/90 md:text-[24px]">
              {product.description}
            </p>
            <strong className="mt-8 block text-[34px] leading-none text-white md:text-[42px]">
              {product.price} EUR
            </strong>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 pt-20 md:pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 md:grid-cols-3">
              {product.gallery.map((image, index) => (
                <a
                  key={image}
                  href={image}
                  className="ld-pf-card group relative aspect-square overflow-hidden rounded-[4px] bg-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(to_bottom_left,var(--color-brand-gradient-start)_0%,var(--color-brand-gradient-stop)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
                </a>
              ))}
            </div>

            <div className="mt-14">
              <h2 className="text-[40px] font-bold leading-none text-black">
                {product.heading}
              </h2>
              <p className="mt-5 text-[22px] font-light leading-relaxed text-[#797b86]">
                Kicsit hosszabb termekleiras Kicsit hosszabb termekleiras
                Kicsit hosszabb termekleiras Kicsit hosszabb termekleiras
                Kicsit hosszabb termekleiras.
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-[15px] bg-white p-7 shadow-[0_16px_50px_rgba(0,0,0,0.07)] md:p-10">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h3 className="text-[24px] font-light leading-tight text-black">
                {product.title}
              </h3>
              <strong className="text-[28px] leading-none text-black">
                {product.price} EUR
              </strong>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Info icon={<Maximize />} label="Dimensions" value="11.1 x 15.5 cm" />
              <Info icon={<Printer />} label="Print" value="Digital" />
              <Info icon={<FileText />} label="Paper" value="170g glossy paper" />
              <Info icon={<Truck />} label="Delivery" value="5-9 days" />
            </div>

            <Link
              href={product.ctaHref}
              target={product.ctaHref.startsWith("http") ? "_blank" : undefined}
              className="mt-10 inline-flex h-14 w-full items-center justify-center rounded-full bg-brand-primary px-8 text-[16px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-secondary"
            >
              Order
            </Link>
          </aside>
        </div>
      </section>

      {cards && (
        <section className="container mx-auto px-4 pb-24 pt-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {cards.map((item) => (
              <ProductBox
                key={`${item.title}-${item.image}`}
                href={item.href ?? product.ctaHref}
                imageSrc={item.image}
                title={item.title}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 pb-24 pt-4 md:grid-cols-2">
        <div>
          <h2 className="text-[34px] font-bold leading-none text-black md:text-[42px]">
            Additional information
          </h2>
          <p className="mt-6 text-[20px] font-light leading-relaxed text-[#797b86]">
            YoloBook albums are perfect for any occasion! That&apos;s why we
            offer a wide variety of album covers for you to choose from. The
            resolution of the images you send naturally affects the print
            quality, so we recommend uploading high-quality photos.
          </p>
        </div>
        <div className="relative aspect-[4/3]">
          <Image
            src={product.mainImage}
            alt={product.title}
            fill
            className="object-contain"
          />
        </div>
      </section>
    </div>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f3f5f7] text-brand-secondary [&_svg]:size-6">
        {icon}
      </div>
      <div>
        <div className="text-[12px] font-bold uppercase tracking-wider text-[#a7a9b8]">
          {label}
        </div>
        <div className="text-[18px] font-medium text-black">{value}</div>
      </div>
    </div>
  )
}
