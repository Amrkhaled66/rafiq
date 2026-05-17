import type { ReactNode } from "react";

export default function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-foreground text-lg font-bold">{title}</h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
