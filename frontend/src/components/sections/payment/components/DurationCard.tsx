"use client";

import { Icon } from "@iconify/react";
import type { MonthPlan } from "@/src/data/plans";

type DurationCardProps = {
  option: MonthPlan;
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

const DurationCard = ({
  option,
  label,
  isSelected,
  onClick,
}: DurationCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={[
        "group relative flex min-h-[128px] flex-col overflow-hidden rounded-2xl border p-2.5 text-start transition-all duration-300 sm:min-h-[150px] sm:rounded-3xl sm:p-4",
        isSelected
          ? "border-brand-primary bg-[rgba(208,5,7,0.045)] shadow-[0_14px_34px_rgba(208,5,7,0.12)]"
          : "border-slate-200 bg-white shadow-sm hover:border-[rgba(208,5,7,0.35)]",
      ].join(" ")}
    >
      {isSelected ? (
        <span className="absolute -left-8 -top-8 size-20 rounded-full bg-[rgba(208,5,7,0.08)] sm:size-24" />
      ) : null}

      <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-3">
        <div className="min-h-6">
          {option.badge ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(208,5,7,0.08)] px-2 py-1 text-[9px] font-black text-brand-primary sm:px-3 sm:text-[11px]">
              <Icon icon="solar:crown-bold" className="text-[10px] sm:text-xs" />
              {option.badge}
            </span>
          ) : null}
        </div>

        <span
          className={[
            "flex size-5 shrink-0 items-center justify-center rounded-full border transition sm:size-6",
            isSelected
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-slate-300 bg-white text-transparent group-hover:border-brand-primary",
          ].join(" ")}
        >
          <Icon icon="solar:check-bold" className="text-xs sm:text-sm" />
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-4">
        <p className="mb-2 text-xs font-black text-slate-950 sm:text-base">
          {label}
        </p>

        <div className="flex flex-col gap-1">
          {option.originalPrice ? (
            <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400 line-through sm:text-xs">
              {option.originalPrice} جنيه
            </span>
          ) : null}

          <p className="text-lg font-black leading-none text-brand-primary sm:text-2xl">
            {option.price}
            <span className="mr-1 text-[11px] font-black sm:text-sm">
              جنيه
            </span>
          </p>
        </div>
      </div>
    </button>
  );
};

export default DurationCard;