import type { ReactNode } from "react";

export default function StatsRow({ children }: { children: ReactNode }) {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">{children}</section>
  );
}

