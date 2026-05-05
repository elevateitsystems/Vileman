import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionHeroProps {
  title: string;
  description?: React.ReactNode;
  bgImage?: string;
  className?: string;
  roundedBottom?: boolean;
}

const SectionHero = ({
  title,
  description,
  bgImage,
  className,
  roundedBottom = true,
}: SectionHeroProps) => {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center text-center overflow-hidden",
        bgImage
          ? "min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-cover bg-center"
          : "pt-20 pb-16",
        roundedBottom && "pb-32 md:pb-48 lg:pb-64",
        className,
      )}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h1
          className={cn(
            "mb-4 text-[42px] font-bold leading-tight md:text-[60px]",
            bgImage ? "portfolio-heading uppercase text-white" : "text-black",
          )}
        >
          {title}
        </h1>
        {description && (
          <div
            className={cn(
              "mx-auto max-w-4xl space-y-6 text-[21px] font-light md:text-[22px]",
              bgImage ? "text-white" : "text-gray-600",
            )}
          >
            {description}
          </div>
        )}
      </div>

      {roundedBottom && (
        <div className="absolute -bottom-[30px] left-[-1px] right-0 w-[101%] h-[8vw] min-h-[82px] pointer-events-none z-20">
          <Image
            src="/img/misc/talas.svg"
            alt=""
            fill
            className="object-cover object-right transform scale-x-[-1]"
            priority
          />
        </div>
      )}
    </section>
  );
};

export default SectionHero;
