import { Icon } from "@iconify/react";

import type { DailyTaskProgressStatus } from "@/features/admin/daily-task-progress/services/dailyTaskProgressService";
import FormInput from "@/shared/components/FormInput";

export default function DailyTaskProgressControls({
  date,
  maxDate,
  isToday,
  status,
  finishedStudents,
  unfinishedStudents,
  onDateChange,
  onStatusChange,
}: {
  date: string;
  maxDate: string;
  isToday: boolean;
  status: DailyTaskProgressStatus;
  finishedStudents: number;
  unfinishedStudents: number;
  onDateChange: (date: string) => void;
  onStatusChange: (status: DailyTaskProgressStatus) => void;
}) {
  const tabs: Array<{
    value: DailyTaskProgressStatus;
    label: string;
    count: number;
    icon: string;
  }> = [
    {
      value: "unfinished",
      label: "لم يكملوا المهام",
      count: unfinishedStudents,
      icon: "solar:danger-triangle-linear",
    },
    {
      value: "finished",
      label: "أكملوا جميع المهام",
      count: finishedStudents,
      icon: "solar:check-circle-linear",
    },
  ];

  return (
    <section className="dashboard-card grid gap-5 lg:grid-cols-[minmax(220px,0.35fr)_minmax(0,1fr)] lg:items-end">
      <FormInput
        label="يوم المتابعة"
        name="daily-task-progress-date"
        type="date"
        value={date}
        max={maxDate}
        icon={<Icon icon="solar:calendar-date-linear" />}
        onChange={(event) => onDateChange(event.target.value)}
      />

      <div>
        <div className="text-foreground mb-2 text-right text-sm font-semibold">
          حالة الإنجاز
        </div>
        <div
          className="grid grid-cols-1 gap-2 rounded-lg bg-slate-100 p-1 sm:grid-cols-2"
          role="tablist"
          aria-label="حالة إنجاز الطلاب"
        >
          {tabs.map((tab) => {
            const isActive = status === tab.value;
            const isDisabled = isToday && tab.value === "unfinished";
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={isDisabled}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-brand-primary shadow-sm"
                    : isDisabled
                      ? "cursor-not-allowed text-slate-400 opacity-60"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                }`}
                onClick={() => onStatusChange(tab.value)}
              >
                <span className="flex items-center gap-2">
                  <Icon icon={tab.icon} className="size-5" />
                  {tab.label}
                </span>
                <span
                  className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
