import type { ReactNode } from "react";

interface ProductInfoProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function ProductInfo({ icon, label, value }: ProductInfoProps) {
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
  );
}
