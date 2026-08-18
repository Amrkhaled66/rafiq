import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import DebouncedSearchField from "@/features/admin/shared/components/DebouncedSearchField";

type CoachOption = {
  label: string;
  value: string;
};

export default function MissedTasksFilters({
  from,
  to,
  status,
  coachId,
  studentPhone,
  canReadCoaches,
  coachOptions,
  coachesLoading,
  onFromChange,
  onToChange,
  onStatusChange,
  onCoachChange,
  onStudentPhoneChange,
}: {
  from: string;
  to: string;
  status: "" | "resolved" | "unresolved";
  coachId: string;
  studentPhone: string;
  canReadCoaches: boolean;
  coachOptions: CoachOption[];
  coachesLoading: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onStatusChange: (value: "" | "resolved" | "unresolved") => void;
  onCoachChange: (value: string) => void;
  onStudentPhoneChange: (value: string) => void;
}) {
  return (
    <section className="dashboard-card">
      <div
        className={`grid grid-cols-1 gap-4 ${
          canReadCoaches ? "md:grid-cols-5" : "md:grid-cols-4"
        }`}
      >
        <DebouncedSearchField
          label="رقم هاتف الطالب"
          name="missed-tasks-student-phone"
          placeholder="ابحث برقم الهاتف"
          value={studentPhone}
          onChange={onStudentPhoneChange}
        />
        <FormInput
          label="من"
          type="date"
          name="missed-tasks-from"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
        />
        <FormInput
          label="إلى"
          type="date"
          name="missed-tasks-to"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
        />
        <DropdownField
          label="حالة الحل"
          value={status}
          placeholder="كل الحالات"
          items={[
            { label: "كل الحالات", value: "" },
            { label: "محلولة", value: "resolved" },
            { label: "غير محلولة", value: "unresolved" },
          ]}
          onChange={(value) =>
            onStatusChange(value as "" | "resolved" | "unresolved")
          }
        />
        {canReadCoaches ? (
          <DropdownField
            label="المدرب"
            value={coachId}
            placeholder="كل المدربين"
            items={[{ label: "كل المدربين", value: "" }, ...coachOptions]}
            onChange={onCoachChange}
            loading={coachesLoading}
          />
        ) : null}
      </div>
    </section>
  );
}
