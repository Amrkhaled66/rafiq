import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";

import type {
  PlanDay,
  PlanTask,
} from "@/features/admin/plans/components/NewPlanPage/types";
import Button from "@/shared/components/Button";
import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";
import { SCHOOL_SUBJECT_OPTIONS } from "@/shared/const/subjects";
import { formatDateArLong, getDayNameAr } from "@/shared/utils/dates";

const TASKS_PAGE_SIZE = 4;

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
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [day.date, isOpen]);

  const subjects = useMemo(
    () =>
      SCHOOL_SUBJECT_OPTIONS.map((subject) => ({
        label: subject.label,
        value: subject.value,
      })),
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
      <div className="dashboard-card flex max-h-[85vh] flex-col overflow-hidden px-4 py-4 text-right">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="text-subTitle text-xs">{getDayNameAr(day.date)}</div>
            <h3 className="text-foreground text-lg font-bold">
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

        <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pe-1">
          {day.tasks.length === 0 ? (
            <div className="rounded-lg bg-slate-50 px-4 py-5 text-sm text-subTitle">
              لا توجد مهام لهذا اليوم بعد. اضغط "إضافة مهمة" للبدء.
            </div>
          ) : null}

          {visibleTasks.map((task, taskIndex) => (
            <div
              key={task.id}
              className="rounded-lg border border-slate-200 bg-slate-50/40 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Icon icon="solar:checklist-minimalistic-linear" className="size-4 text-brand-primary" />
                  <span>المهمة {start + taskIndex + 1}</span>
                </div>

                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-500/10"
                  onClick={() => onDeleteTask(task.id)}
                  aria-label="حذف المهمة"
                  title="حذف المهمة"
                >
                  <Icon icon="solar:trash-bin-trash-linear" className="size-4.5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(150px,0.75fr)]">
                <FormInput
                  label="مهمة اليوم"
                  name={`task-title-${day.date}-${task.id}`}
                  placeholder="اكتب مهمة اليوم"
                  value={task.title}
                  className="py-2"
                  onChange={(e) =>
                    onUpdateTask(task.id, { title: e.target.value })
                  }
                />

                <DropdownField
                  label="المادة"
                  value={task.subject || undefined}
                  placeholder="اختر المادة"
                  items={subjects}
                  onChange={(value) =>
                    onUpdateTask(task.id, { subject: value })
                  }
                />
              </div>

              <label className="mt-2 block">
                <span className="text-subTitle mb-1 block text-xs font-medium">
                  ملاحظات المهمة
                </span>
                <textarea
                  name={`task-note-${day.date}-${task.id}`}
                  value={task.note ?? ""}
                  maxLength={1000}
                  rows={2}
                  placeholder="أضف تعليمات أو تفاصيل تساعد الطالب"
                  className="border-border text-foreground placeholder:text-subTitle h-14 w-full resize-none rounded-lg border bg-white px-3 py-2 text-right text-sm leading-5 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  onChange={(event) =>
                    onUpdateTask(task.id, { note: event.target.value })
                  }
                />
              </label>
            </div>
          ))}

        </div>

        <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="inline-flex items-center gap-1.5"
              onClick={onAddTask}
            >
              <Icon icon="solar:add-circle-linear" className="size-4" />
              إضافة مهمة
            </Button>
            <span className="text-subTitle text-xs">{day.tasks.length} مهمة</span>
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canShowPrev}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                aria-label="الصفحة السابقة"
                title="الصفحة السابقة"
              >
                <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
              </button>
              <span className="text-subTitle min-w-12 text-center text-xs">
                {safePageIndex + 1} / {totalPages}
              </span>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canShowMore}
                onClick={() =>
                  setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                }
                aria-label="الصفحة التالية"
                title="الصفحة التالية"
              >
                <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
