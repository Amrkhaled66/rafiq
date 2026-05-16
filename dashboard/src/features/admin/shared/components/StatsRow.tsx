import type { ReactNode } from "react";

export default function StatsRow({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">{children}</section>
  );
}

