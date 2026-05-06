import { Icon } from "@iconify/react";
import clsx from "clsx";

const weekDays = ["س", "ح", "ث", "ت"];
const subjects = ["الرياضيات", "الفيزياء", "الكيمياء"];

export default function WeeklyPlanCard() {
  return (
    <div className="w-full sm:max-w-[18rem] rotate-[5deg] rounded-[28px] border border-[rgba(208,5,7,0.1)] bg-white p-3 sm:p-5 shadow-[0_20px_40px_rgba(208,5,7,0.12)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs sm:text-base md:text-lg font-bold text-black">
          الخطة الأسبوعية
        </h3>

        <Icon
          icon="solar:calendar-linear"
          className="size-4 sm:size-5 text-[var(--brand-primary)]"
        />
      </div>

      <div className="mb-5 grid grid-cols-4 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-semibold text-black/60">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={clsx(
              "rounded-full px-1 sm:px-2 py-1.5 sm:py-2",
              index === 2 &&
                "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {subjects.map((subject, index) => (
          <span
            key={subject}
            className={clsx(
              "rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold",
              index % 2 === 0 &&
                "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]",
              index % 2 !== 0 && "bg-black/[0.04] text-black/70",
            )}
          >
            {subject}
          </span>
        ))}
      </div>
    </div>
  );
}