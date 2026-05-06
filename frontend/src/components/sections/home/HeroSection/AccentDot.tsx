import clsx from "clsx";

export default function AccentDot({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute rounded-full bg-[color:rgba(239,169,171,0.5)] blur-[1px]",
        className,
      )}
      aria-hidden="true"
    />
  );
}
