import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import type { PlanDay } from "@/features/admin/plans/components/NewPlanPage/types";
import { formatDateArLong, getDayNameAr } from "@/shared/utils/dates";

const GRID_TASKS_PAGE_SIZE = 3;

export default function PlanCalendarGrid({
  days,
  selectedDayDate,
  onSelectDay,
}: {
  days: PlanDay[];
  selectedDayDate: string | null;
  onSelectDay: (dayDate: string) => void;
}) {
  const [visibleTasksByDay, setVisibleTasksByDay] = useState<Record<string, number>>({});

  useEffect(() => {
    setVisibleTasksByDay((prev) => {
      const next: Record<string, number> = {};
      for (const day of days) {
        next[day.date] = prev[day.date] ?? GRID_TASKS_PAGE_SIZE;
      }
      return next;
    });
  }, [days]);

  return (
    <section className="dashboard-card lg:col-span-2 space-y-4 text-right">
      <div>
        <h2 className="text-foreground text-lg font-bold">أيام الخطة</h2>
        <p className="text-subTitle mt-1 text-sm">
          اضغط على يوم لعرض المهام وتعديلها.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {days.map((day) => {
          const isSelected = day.date === selectedDayDate;
          const hasTasks = day.tasks.length > 0;
          const visibleCount = visibleTasksByDay[day.date] ?? GRID_TASKS_PAGE_SIZE;
          const tasksToShow = day.tasks.slice(0, visibleCount);
          const hasMore = day.tasks.length > visibleCount;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(day.date)}
              className={`group relative w-full overflow-hidden rounded-2xl border p-3 text-right transition ${
                isSelected
                  ? "border-brand-primary bg-brand-primary/5"
                  : hasTasks
                    ? "border-emerald-200 border-l-3 border-l-emerald-800 bg-emerald-50 hover:bg-emerald-100/50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="text-subTitle text-xs">
                {getDayNameAr(day.date)}
              </div>
              <div className="text-foreground mt-1 text-sm font-semibold">
                {formatDateArLong(day.date)}
              </div>

              <div className="mt-3 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  <span>عدد المهام:</span>
                  <span className="font-semibold">{day.tasks.length}</span>
                </div>

                {tasksToShow.length > 0 ? (
                  <div className="flex flex-col gap-1 text-xs text-slate-700">
                    {tasksToShow.map((t) => (
                      <div
                        key={t.id}
                        className="line-clamp-1 flex items-center gap-2 rounded-lg px-2 py-1 text-slate-800"
                      >
                        <span className="size-1.5 bg-emerald-600 rounded-full" ></span>
                        {t.title?.trim() ? t.title : "مهمة بدون عنوان"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-subTitle text-xs">لا توجد مهام</div>
                )}

                {hasMore ? (
                  <div className="flex justify-start">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVisibleTasksByDay((prev) => ({
                          ...prev,
                          [day.date]: Math.min(
                            day.tasks.length,
                            visibleCount + GRID_TASKS_PAGE_SIZE,
                          ),
                        }));
                      }}
                      aria-label="عرض المزيد من المهام"
                      title="عرض المزيد"
                    >
                      <Icon icon="solar:alt-arrow-down-linear" className="size-4" />
                    </button>
                  </div>
                ) : null}
              </div>

              {isSelected ? (
                <span className="bg-brand-primary absolute inset-y-0 end-0 w-1" />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
