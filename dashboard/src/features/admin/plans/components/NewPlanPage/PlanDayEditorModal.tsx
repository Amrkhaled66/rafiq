import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";

import type {
  PlanDay,
  PlanTask,
} from "@/features/admin/plans/components/NewPlanPage/types";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import { formatDateArLong, getDayNameAr } from "@/shared/utils/dates";

const TASKS_PAGE_SIZE = 3;

export default function PlanDayEditorModal({
  isOpen,
  day,
  onClose,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
}: {
  isOpen: boolean;
  day: PlanDay;
  onClose: () => void;
  onUpdateTask: (taskId: string, patch: Partial<PlanTask>) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
}) {
  // Page tasks instead of revealing all at once.
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    // Reset pagination when opening a different day.
    setPageIndex(0);
  }, [day.date, isOpen]);

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

  const totalPages = Math.max(1, Math.ceil(day.tasks.length / TASKS_PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const start = safePageIndex * TASKS_PAGE_SIZE;
  const end = start + TASKS_PAGE_SIZE;
  const visibleTasks = day.tasks.slice(start, end);
  const canShowMore = safePageIndex < totalPages - 1;
  const canShowPrev = safePageIndex > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card max-h-[85vh] overflow-auto text-right">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-subTitle text-sm">{getDayNameAr(day.date)}</div>
            <h3 className="text-foreground text-xl font-bold">
              {formatDateArLong(day.date)}
            </h3>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            onClick={onClose}
            aria-label="إغلاق"
            title="إغلاق"
          >
            <Icon icon="solar:close-circle-linear" className="size-6" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {day.tasks.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-subTitle">
              لا توجد مهام لهذا اليوم بعد. اضغط "إضافة مهمة" للبدء.
            </div>
          ) : null}

          {visibleTasks.map((task) => (
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

          {canShowMore ? (
            <div className="flex justify-start">
              <Button
                variant="outline"
                onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              >
                عرض المزيد
              </Button>
            </div>
          ) : null}

          {canShowPrev ? (
            <div className="flex justify-start">
              <Button variant="outline" onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>
                عرض السابق
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onAddTask}>
            إضافة مهمة
          </Button>

          <div className="text-subTitle text-sm">
            {day.tasks.length} مهمة
          </div>
        </div>
      </div>
    </Modal>
  );
}
