import { Icon } from "@iconify/react";
import Image, { StaticImageData } from "next/image";
type ProblemCardProps = {
  index: number;
  title: string;
  description: string;
  icon: string | StaticImageData;
  iconType: string;
  accentClassName: string;
  className?: string;
};

export default function ProblemCard({
  title,
  description,
  icon,
  iconType,
  accentClassName,
  className = "",
  index,
}: ProblemCardProps) {
  return (
    <article
      className={` ${index % 2 !== 0 && "flex-row-reverse"} flex w-full mx-auto max-w-sm items-start gap-4 rounded-4xl border border-white/70 bg-white px-5 py-5 text-right shadow-[0_24px_60px_rgba(144,15,25,0.12)] backdrop-blur-sm ${className}`}
    >
      <div
        className={`flex size-20 shrink-0 items-center justify-center rounded-full ${accentClassName}`}
      >
        {iconType === "icon" && typeof icon === "string" ? (
          <Icon icon={icon} className="size-12" />
        ) : (
          <Image src={icon} alt={title} className="size-20" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-brand-primary sm:text-xl">
          {title}
        </h3>
        <p className="text-sm leading-7 text-slate-700 sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}
