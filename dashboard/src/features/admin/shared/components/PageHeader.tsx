import type { ReactNode } from "react";
import Button from "@/shared/components/Button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  action?: ReactNode;
  icon?: string;
};

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  action,
}: PageHeaderProps) {
  return (
    <section className="from-brand-primary/80 via-brand-primary/70 to-brand-primary/15 relative overflow-hidden drop-shadow-sm rounded-xl bg-linear-to-l px-8 py-7 shadow-lg">
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 size-40 rounded-full bg-white/10" />

      <div className="absolute right-1/3 -bottom-27 size-48 rounded-full bg-white/50" />

      <div className="relative flex flex-col items-start justify-between gap-5 text-right md:flex-row">
        <div className="flex w-full items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white md:text-3xl">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-white/85 md:text-base">{subtitle}</p>
            )}
          </div>
        </div>

        {action ? (
          <div className="relative flex h-fit w-full justify-end">{action}</div>
        ) : actionLabel ? (
          <div className="relative flex h-fit">
            <Button
              onClick={onAction}
              className="text-brand-primary inline-flex items-center gap-2 rounded-xl bg-white font-bold hover:bg-white/90"
            >
              {actionIcon}
              <span>{actionLabel}</span>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
