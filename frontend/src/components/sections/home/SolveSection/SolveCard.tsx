import { Icon } from "@iconify/react";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";

export type SolveCardAccent = {
  title: string;
  pill: string;
  blob: string;
  border: string;
  shadow?: string;
};

export type SolveCardItem = {
  step: string;
  title: string;
  subtitle: string;
  accent: SolveCardAccent;
  image: StaticImageData;
  imageAlt: string;
  cardClassName?: string;
  imageClassName?: string;
  sparkle?: boolean;
  layoutClassName?: string;
};

type SolveCardProps = SolveCardItem;

export default function SolveCard({
  step,
  title,
  subtitle,
  accent,
  image,
  imageAlt,
  cardClassName,
  imageClassName,
  sparkle = false,
}: SolveCardProps) {
  return (
    <article
      id="solve-card"
      className={clsx(
        "relative  cursor-pointer rounded-[26px] border-2 bg-white",
        "px-6 py-6 sm:px-7 sm:py-7",
        "shadow-[0_18px_45px_rgba(15,23,42,0.055)]",
        accent.border,
        accent.shadow,
        cardClassName,
      )}
    >
      {sparkle && (
        <div className="absolute inset-e-5 top-5 z-20 text-brand-primary">
          <Icon icon="ph:sparkle-fill" className="size-5" />
        </div>
      )}

      <div className="flex h-full items-center justify-between gap-5">
        <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start text-start">
          <div
            className={clsx(
              "mb-5 flex size-12 items-center justify-center rounded-2xl",
              "text-xl font-extrabold leading-none",
              accent.pill,
            )}
          >
            {step}
          </div>

          <h3
            className={clsx(
              "text-[21px] font-extrabold leading-normal",
              accent.title,
            )}
          >
            {title}
          </h3>

          <p className="mt-3 max-w-60 text-[15px] font-medium leading-7 text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="relative z-10 flex shrink-0 items-center justify-center">
          <div
            className={clsx(
              "absolute size-30 rounded-full h-32 w-32",
              accent.blob,
            )}
          />
          <Image
            src={image}
            alt={imageAlt}
            className={clsx(
              "relative z-10 h-auto w-36.5 translate-y-5 object-contain",
              imageClassName,
            )}
          />
        </div>
      </div>
    </article>
  );
}
