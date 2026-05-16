import { Icon } from "@iconify/react";
import { useMemo } from "react";

import type {
  PlanDay,
  PlanTask,
} from "@/features/admin/plans/components/NewPlanPage/types";
import Button from "@/shared/components/Button";
import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import { formatDateArLong, getDayNameAr } from "@/shared/utils/dates";

export default function NewPlanDayContainer({
  day,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
}: {
  day: PlanDay;
  onUpdateTask: (taskId: string, patch: Partial<PlanTask>) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const subjects = useMemo(
    () => [
      { label: "رياضيات", value: "math" },
      { label: "لغة عربية", value: "arabic" },
      { label: "لغة إنجليزية", value: "english" },
      { label: "فيزياء", value: "physics" },
      { label: "كيمياء", value: "chemistry" },
      { label: "أحياء", value: "biology" },
      { label: "تاريخ", value: "history" },
      { label: "جغرافيا", value: "geography" },
    ],
    [],
  );

  return (
    <div className="text-right">
      <div className="flex items-center justify-between gap-3 rounded-ss-xl rounded-se-xl bg-white/95 px-4 py-3 drop-shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-brand-primary-active h-8 w-2 rounded-3xl"></span>
          <div className="text-foreground text-base font-bold">
            {getDayNameAr(day.date)} {formatDateArLong(day.date)}
          </div>
        </div>
        <div className="text-foreground space-x-2 rounded-3xl bg-black/10 px-3 py-1 text-xs font-bold">
          <span>عدد المهام:</span>
          <span>{day.tasks.length}</span>
        </div>
      </div>

      <div className="dashboard-card space-y-4 rounded-ss-none rounded-se-none">
        {day.tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-[1fr_1fr_auto] items-end gap-3"
          >
            <FormInput
              label="مهمة اليوم"
              name={`task-title-${day.date}-${task.id}`}
              placeholder="اكتب مهمة اليوم"
              value={task.title}
              onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
            />

            <DropdownField
              label="المادة"
              value={task.subject || undefined}
              placeholder="اختر المادة"
              items={subjects}
              onChange={(value) => onUpdateTask(task.id, { subject: value })}
            />

            <button
              type="button"
              className="mb-1 inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-500/10"
              onClick={() => onDeleteTask(task.id)}
              aria-label="حذف المهمة"
              title="حذف المهمة"
            >
              <Icon icon="solar:trash-bin-trash-linear" className="size-5" />
            </button>
          </div>
        ))}

        <Button variant="ghost" className="w-fit" onClick={onAddTask}>
          إضافة مهمة
        </Button>
      </div>
    </div>
  );
}
