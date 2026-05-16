import { Icon } from "@iconify/react";

import type { AssignedCoach } from "@/features/admin/students/services/studentService";
import DropDownMenu from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

export default function NewPlanPeriodCard({
  name,
  onNameChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  duration,
  isSuperAdmin,
  assignedCoaches,
  coachId,
  onCoachIdChange,
}: {
  name: string;
  onNameChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  duration: number | undefined;
  isSuperAdmin: boolean;
  assignedCoaches: AssignedCoach[];
  coachId: number | null;
  onCoachIdChange: (value: number | null) => void;
}) {
  return (
    <div className="dashboard-card h-fit space-y-5 text-right">
      <div className="inline-flex items-center gap-2">
        <Icon
          icon="solar:calendar-mark-linear"
          className="text-brand-primary size-5"
        />
        <h2 className="text-foreground text-lg font-bold">تحديد فترة الخطة</h2>
      </div>

      <div className="space-y flex flex-col gap-3">
        <FormInput
          label="اسم الخطة"
          name="plan-name"
          placeholder="اكتب اسم الخطة"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />

        {isSuperAdmin ? (
          <DropDownMenu
            label="المدرب"
            value={coachId ? String(coachId) : ""}
            placeholder={
              assignedCoaches.length > 0 ? "اختر مدربًا" : "لا يوجد مدربون معينون"
            }
            items={assignedCoaches.map((c) => ({
              label: `${c.fullName} (${c.phone})`,
              value: String(c.id),
            }))}
            onChange={(value) => {
              const next = Number(value);
              onCoachIdChange(Number.isFinite(next) && next > 0 ? next : null);
            }}
          />
        ) : null}

        <FormInput
          label="From"
          name="plan-from"
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
        />
        <FormInput
          label="To"
          name="plan-to"
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
        />
      </div>

      {duration ? (
        <div className="bg-brand-primary-soft flex justify-between rounded-xl px-4 py-3 text-sm font-medium">
          <span>مدة الخطة:</span>
          <span className="text-brand-primary-active font-bold">
            {duration} أيام
          </span>
        </div>
      ) : null}
    </div>
  );
}
