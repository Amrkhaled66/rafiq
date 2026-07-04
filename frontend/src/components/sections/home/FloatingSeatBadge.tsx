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
        "group fixed bottom-5 left-5 z-50 hidden sm:flex",
        "items-center gap-4 rounded-3xl border border-slate-100 bg-white/95",
        "px-4 py-3 shadow-[0_18px_55px_rgba(15,23,42,0.13)] backdrop-blur-md",
        "transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.17)]",
        className,
      ].join(" ")}
    >
      <span className="relative flex size-16 shrink-0 items-center justify-center rounded-3xl bg-[rgba(208,5,7,0.07)] shadow-inner">
        <Image
          src={seatIcon}
          alt=""
  
          className="object-contain size-10 drop-shadow-[0_10px_18px_rgba(208,5,7,0.22)]"
        />
      </span>

      <div className="min-w-[120px]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black leading-none text-brand-primary">
            {availableSeats}
          </span>

          <span className="text-sm font-extrabold text-slate-950">
            {title}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand-primary shadow-[0_0_0_5px_rgba(208,5,7,0.08)]" />

          <span className="text-sm font-extrabold text-brand-primary">
            {subtitle}
          </span>
        </div>
      </div>

      <span className="h-10 w-px bg-slate-200" />

      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(208,5,7,0.08)] text-brand-primary transition duration-300 group-hover:-translate-y-1">
        <Icon icon="solar:arrow-left-linear" className="text-xl rotate-135" />
      </span>
    </Link>
  );
};

export default FloatingSeatBadge;