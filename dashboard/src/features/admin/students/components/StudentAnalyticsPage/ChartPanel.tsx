import type { ReactNode } from "react";
import { Icon } from "@iconify/react";

export default function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="dashboard-card space-y-5 text-right">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-brand-primary/10 text-brand-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Icon icon="solar:chart-2-linear" className="size-5" />
            </span>
            <h2 className="text-foreground text-lg font-bold">{title}</h2>
          </div>
          <p className="text-subTitle mt-1 text-sm leading-6">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
