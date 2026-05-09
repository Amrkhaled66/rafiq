import Link from "next/link";
import { Icon } from "@iconify/react";
import type { ReactNode } from "react";

export default function HeroCta({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: ReactNode;
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-primary px-5 py-3 text-base font-bold text-white shadow-[0_18px_30px_rgba(208,5,7,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)] md:px-6 md:py-4"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 transition-colors duration-200 group-hover:bg-white/18">
          <Icon icon="solar:arrow-left-linear" className="h-5 w-5" />
        </span>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-brand-primary bg-white px-5 py-3 text-base font-bold text-brand-primary shadow-[0_10px_24px_rgba(208,5,7,0.08)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-primary-soft active:bg-[color:rgba(239,169,171,0.45)] md:px-6 md:py-4"
    >
      {children}
    </Link>
  );
}
