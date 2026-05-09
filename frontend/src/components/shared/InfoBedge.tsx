"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";

type InfoBadgeProps = {
  text: string;
  icon: string;
  className?: string;
  iconClassName?: string;
};

export default function InfoBadge({
  text,
  icon,
  className,
  iconClassName,
}: InfoBadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 rounded-full border px-3 py-2",
        "bg-(--brand-primary-soft)/20",
        "border-(--brand-primary-soft)",
        "text-brand-primary",
        "shadow-[0_4px_20px_rgba(208,5,7,0.06)]",
        className,
      )}
    >
      <span className="text-sm font-bold leading-none">{text}</span>
      <Icon
        icon={icon}
        className={clsx("size-8 text-brand-primary", iconClassName)}
      />
    </div>
  );
}
