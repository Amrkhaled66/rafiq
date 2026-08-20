import type { ReactNode } from "react";
import Button from "@/shared/components/Button";
import { Icon } from "@iconify/react";

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
  icon,
}: PageHeaderProps) {
  return (
    <section className="from-brand-primary/80 via-brand-primary/50 to-brand-primary/20 relative overflow-hidden rounded-xl bg-linear-to-l px-8 py-7 shadow-lg">
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 size-40 rounded-full bg-white/10" />

      <div className="absolute right-1/3 -bottom-20 size-48 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-start justify-between gap-5 text-right md:flex-row">
        <div className="flex items-center gap-4">
          {/* {icon ? (
            <div
              aria-hidden="true"
              className="flex size-18 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-white backdrop-blur"
            >
              <Icon icon={icon} className="size-10" />
            </div>
          ) : null} */}

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white md:text-3xl">
              {title}
            </h1>

            {subtitle && (
              <p className="max-w-xl text-sm text-white/85 md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action ? (
          <div className="relative flex h-fit">{action}</div>
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
