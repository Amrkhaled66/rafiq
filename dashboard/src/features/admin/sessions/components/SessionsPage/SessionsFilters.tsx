import DropDownMenu from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

import type { SessionStatus } from "@/features/admin/sessions/services/sessionService";

export default function SessionsFilters({
  studentPhone,
  status,
  from,
  to,
  onStudentPhoneChange,
  onStatusChange,
  onFromChange,
  onToChange,
}: {
  studentPhone: string;
  status: "" | SessionStatus;
  from: string;
  to: string;
  onStudentPhoneChange: (value: string) => void;
  onStatusChange: (value: "" | SessionStatus) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <section className="dashboard-card">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <FormInput
          label="رقم هاتف الطالب"
          name="sessions-student-phone"
          placeholder="ابحث برقم الهاتف"
          value={studentPhone}
          onChange={(event) => onStudentPhoneChange(event.target.value)}
        />

        <DropDownMenu
          label="الحالة"
          value={status}
          placeholder="كل الحالات"
          items={[
            { label: "كل الحالات", value: "" },
            { label: "جارية", value: "running" },
            { label: "مكتملة", value: "completed" },
            { label: "متوقفة", value: "stopped" },
          ]}
          onChange={(value) => onStatusChange(value as "" | SessionStatus)}
        />

        <FormInput
          label="من"
          type="date"
          name="sessions-from"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
        />

        <FormInput
          label="إلى"
          type="date"
          name="sessions-to"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
        />
      </div>
    </section>
  );
}
