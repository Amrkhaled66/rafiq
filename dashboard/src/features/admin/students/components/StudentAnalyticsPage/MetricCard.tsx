import { Icon } from "@iconify/react";

export default function MetricCard({
  title,
  value,
  detail,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: string;
  color: string;
}) {
  return (
    <article className="dashboard-card flex min-h-32 items-start justify-between gap-4 text-right">
      <div className="min-w-0 space-y-2">
        <p className="text-subTitle text-xs font-semibold leading-5">{title}</p>
        <p className="text-foreground text-2xl font-black leading-8">{value}</p>
        <p className="text-subTitle text-xs leading-5">{detail}</p>
      </div>
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        <Icon icon={icon} className="size-5" />
      </span>
    </article>
  );
}
