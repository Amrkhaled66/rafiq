import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  className?: string;
};

function hexToRgba(color: string, alpha: number) {
  const hex = color.replace("#", "");

  if (hex.length !== 6) {
    return color;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "#d00507",
  className
}: StatCardProps) {
  const iconWrapperStyle: CSSProperties = {
    backgroundColor: hexToRgba(color, 0.12),
    color,
  };

  return (
    <article className="group dashboard-card flex w-full items-start justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:max-w-xs">
      <div className="space-y-2 text-right">
        <p className="text-subTitle text-sm font-medium">{title}</p>

        <p
          style={{
            color,
          }}
          className={clsx(
            "text-foreground text-3xl leading-none font-bold",
            className,
          )}
        >
          {value}
        </p>
      </div>

      <div
        style={iconWrapperStyle}
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
      >
        <span className="[&_svg]:size-7">{icon}</span>
      </div>
    </article>
  );
}
