import { Icon } from "@iconify/react";

import type {
  PlanDay,
  PlanTask,
} from "@/features/admin/plans/components/NewPlanPage/types";
import NewPlanDayContainer from "./NewPlanDayContainer";
import { getDayNameAr, formatDateArLong } from "@/shared/utils/dates";

export default function NewPlanDaysSection({
  days,
  visibleDaysCount,
  onRevealNextDay,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
}: {
  days: PlanDay[];
  visibleDaysCount: number;
  onRevealNextDay: () => void;
  onUpdateTask: (
    dayDate: string,
    taskId: string,
    patch: Partial<PlanTask>,
  ) => void;
  onAddTask: (dayDate: string) => void;
  onDeleteTask: (dayDate: string, taskId: string) => void;
}) {
  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-xl font-bold">ايام الخطة</h2>
      {visibleDaysCount === 0 ? (
        <div className="dashboard-card text-right">
          <h2 className="text-foreground text-lg font-bold">أيام الخطة</h2>
          <p className="text-subTitle mt-1 text-sm">
            اختر فترة الخطة من اليمين لبدء إنشاء أيام الخطة.
          </p>
        </div>
      ) : null}

      {days.slice(0, visibleDaysCount).map((day) => (
        <NewPlanDayContainer
          key={day.date}
          day={day}
          onUpdateTask={(taskId, patch) =>
            onUpdateTask(day.date, taskId, patch)
          }
          onAddTask={() => onAddTask(day.date)}
          onDeleteTask={(taskId) => onDeleteTask(day.date, taskId)}
        />
      ))}

      {visibleDaysCount > 0 && visibleDaysCount < days.length ? (
        <div
          onClick={onRevealNextDay}
          className="bg-black/5 animate flex cursor-pointer flex-col items-center justify-center gap-2 space-y-1 rounded-xl py-6 hover:bg-black/10"
        >
          <div className="text-foreground flex items-center gap-1 text-sm font-medium">
            {/*  */}
            <span>
              {getDayNameAr(days[visibleDaysCount]?.date)} -{" "}
              {formatDateArLong(days[visibleDaysCount]?.date)}
            </span>
          </div>
          <span className="inline-flex">
            <Icon icon="material-symbols:add-rounded" className="size-5" />
            ابدا بتعبئة اليوم التالي
          </span>
        </div>
      ) : null}
    </div>
  );
}
