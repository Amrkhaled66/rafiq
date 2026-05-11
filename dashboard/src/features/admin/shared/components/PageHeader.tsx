import type { ReactNode } from "react";
import Button from "@/shared/components/Button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
}: PageHeaderProps) {
  return (
    <section className="flex flex-row items-start justify-between gap-4">
      <div className="space-y-2 text-right">
        <h1 className="text-foreground text-2xl font-bold md:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-subTitle text-sm md:text-base">{subtitle}</p>
        ) : null}
      </div>

      {actionLabel ? (
        <div className="flex h-fit justify-start md:justify-end">
          <Button
            onClick={onAction}
            className="inline-flex items-center gap-2 text-sm"
          >
            {actionIcon}
            <span>{actionLabel}</span>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
