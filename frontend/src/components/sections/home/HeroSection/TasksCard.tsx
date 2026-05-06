import { Icon } from "@iconify/react";
import clsx from "clsx";

const tasks = [
  { label: "حل تمارين الرياضيات", done: true },
  { label: "مراجعة الكيمياء", done: false },
  // { label: "قراءة التاريخ", done: false },
];

export default function TasksCard() {
  return (
    <div className="sm:w-64 text-xs rotate-[-4deg] rounded-[28px] border border-[rgba(208,5,7,0.1)] bg-white p-3 sm:p-5 shadow-[0_20px_40px_rgba(208,5,7,0.12)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="sm:text-base md:text-lg font-bold text-black">
          مهام اليوم
        </h3>
        <span className="rounded-full bg-(--brand-primary-soft) px-3 py-1  sm:text-xs font-semibold text-(--brand-primary)">
          3 مهام
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.label}
            className={clsx(
              "flex items-center gap-1 sm:gap-3 rounded-2xl px-1 sm:px-4 py-3 transition-colors duration-200",
              "border-[rgba(208,5,7,0.08)] bg-white",
            )}
          >
            <span
              className={clsx(
                "flex shrink-0 items-center justify-center rounded-full",
                task.done && "text-(--brand-primary)",
                !task.done && " border size-5 border-(--brand-primary)",
              )}
            >
              {task.done && (
                <Icon icon="solar:check-circle-bold" className="size-6" />
              )}
            </span>

            <span className="sm:text-sm md:text-base font-medium text-black/80">
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
