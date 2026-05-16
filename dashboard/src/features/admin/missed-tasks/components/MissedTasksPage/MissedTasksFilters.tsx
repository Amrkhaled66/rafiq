import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

type CoachOption = {
  label: string;
  value: string;
};

export default function MissedTasksFilters({
  from,
  to,
  status,
  coachId,
  isSuperAdmin,
  coachOptions,
  coachesLoading,
  onFromChange,
  onToChange,
  onStatusChange,
  onCoachChange,
}: {
  from: string;
  to: string;
  status: "" | "resolved" | "unresolved";
  coachId: string;
  isSuperAdmin: boolean;
  coachOptions: CoachOption[];
  coachesLoading: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onStatusChange: (value: "" | "resolved" | "unresolved") => void;
  onCoachChange: (value: string) => void;
}) {
  return (
    <section className="dashboard-card">
      <div
        className={`grid grid-cols-1 gap-4 ${
          isSuperAdmin ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
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
        {isSuperAdmin ? (
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
