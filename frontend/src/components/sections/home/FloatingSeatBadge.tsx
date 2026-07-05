"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import seatIcon from "@/src/assets/seat-icon.png";

type FloatingSeatBadgeProps = {
  href?: string;
  availableSeats?: number;
  title?: string;
  subtitle?: string;
  className?: string;
};

const FloatingSeatBadge = ({
  href = "#pricing",
  availableSeats = 30,
  title = "مقعد متاح",
  subtitle = "احجز الآن",
  className = "",
}: FloatingSeatBadgeProps) => {
  return (
    <Link
      href={href}
      dir="rtl"
      aria-label={`${availableSeats} ${title} - ${subtitle}`}
      className={[
        "group fixed bottom-3 left-3 z-50 flex max-w-[calc(100vw-24px)] sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5",
        "items-center gap-2 rounded-2xl border border-slate-100 bg-white/95 sm:gap-3 sm:rounded-[22px] lg:gap-4 lg:rounded-3xl",
        "px-2.5 py-2.5 shadow-[0_14px_38px_rgba(15,23,42,0.13)] backdrop-blur-md sm:px-3 sm:py-3 lg:px-4",
        "transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.17)]",
        className,
      ].join(" ")}
    >
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(208,5,7,0.07)] shadow-inner sm:size-14 sm:rounded-[22px] lg:size-16 lg:rounded-3xl">
        <Image
          src={seatIcon}
          alt=""
          className="size-8 object-contain drop-shadow-[0_10px_18px_rgba(208,5,7,0.22)] sm:size-9 lg:size-10"
        />
      </span>

      <div className="min-w-[88px] sm:min-w-[105px] lg:min-w-[120px]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base font-black leading-none text-brand-primary sm:text-lg lg:text-xl">
            {availableSeats}
          </span>

          <span className="text-xs font-extrabold text-slate-950 sm:text-sm">
            {title}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
          <span className="size-1.5 rounded-full bg-brand-primary shadow-[0_0_0_5px_rgba(208,5,7,0.08)]" />

          <span className="text-xs font-extrabold text-brand-primary sm:text-sm">
            {subtitle}
          </span>
        </div>
      </div>

      <span className="h-8 w-px bg-slate-200 sm:h-9 lg:h-10" />

      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(208,5,7,0.08)] text-brand-primary transition duration-300 group-hover:-translate-y-1 sm:size-10 lg:size-11">
        <Icon
          icon="solar:arrow-left-linear"
          className="rotate-135 text-lg sm:text-xl"
        />
      </span>
    </Link>
  );
};

export default FloatingSeatBadge;