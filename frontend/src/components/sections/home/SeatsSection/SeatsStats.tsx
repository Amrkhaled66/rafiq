import { Icon } from "@iconify/react";
import type { BatchStat } from "./types";

type SeatsStatsProps = {
  total: number;
  reserved: number;
};

const SeatsStats = ({ total, reserved }: SeatsStatsProps) => {
  const available = Math.max(total - reserved, 0);

  const stats: BatchStat[] = [
    {
      label: "إجمالي الأماكن",
      value: total,
      icon: "solar:users-group-rounded-bold",
      tone: "red",
    },
    {
      label: "تم حجزهم",
      value: reserved,
      icon: "solar:user-check-rounded-bold",
      tone: "red",
    },
    {
      label: "متاحين الآن",
      value: available,
      icon: "solar:armchair-2-bold",
      tone: "green",
    },
  ];

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-[30px] border border-[rgba(208,5,7,0.12)] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:grid-cols-3">
      {stats.map((stat, index) => (
        <StatItem
          key={stat.label}
          stat={stat}
          showBorder={index !== stats.length - 1}
        />
      ))}
    </div>
  );
};

export default SeatsStats;

const StatItem = ({
  stat,
  showBorder,
}: {
  stat: BatchStat;
  showBorder: boolean;
}) => {
  const isGreen = stat.tone === "green";

  return (
    <div
      className={[
        "flex items-center justify-center gap-4 px-6 py-7 text-center",
        showBorder ? "border-b border-slate-100 sm:border-b-0 sm:border-l" : "",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          isGreen
            ? "bg-emerald-50 text-emerald-600"
            : "bg-[rgba(208,5,7,0.07)] text-brand-primary",
        ].join(" ")}
      >
        <Icon icon={stat.icon} className="text-3xl" />
      </div>

      <div>
        <div
          className={[
            "text-4xl font-black leading-none sm:text-5xl",
            isGreen ? "text-emerald-600" : "text-brand-primary",
          ].join(" ")}
        >
          {stat.value}
        </div>

        <p className="mt-2 text-sm font-bold text-slate-500">{stat.label}</p>
      </div>
    </div>
  );
};