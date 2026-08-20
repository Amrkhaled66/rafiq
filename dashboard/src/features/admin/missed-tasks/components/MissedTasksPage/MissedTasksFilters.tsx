import FilterPanel from "@/features/admin/shared/components/FilterPanel";
import type { MissedTasksFiltersState } from "@/features/admin/missed-tasks/hooks/useMissedTasksFilterParams";
import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

type CoachOption = { label: string; value: string };

type Props = {
  filters: MissedTasksFiltersState;
  canReadCoaches: boolean;
  coachOptions: CoachOption[];
  coachesLoading: boolean;
  isApplying: boolean;
  hasChanges: boolean;
  hasFilters: boolean;
  onChange: <K extends keyof MissedTasksFiltersState>(
    key: K,
    value: MissedTasksFiltersState[K],
  ) => void;
  onApply: () => void;
  onReset: () => void;
};

export default function MissedTasksFilters(props: Props) {
  return (
    <FilterPanel
      fieldsClassName={`grid grid-cols-1 gap-4 ${
        props.canReadCoaches ? "md:grid-cols-5" : "md:grid-cols-4"
      }`}
      isApplying={props.isApplying}
      hasChanges={props.hasChanges}
      hasFilters={props.hasFilters}
      onApply={props.onApply}
      onReset={props.onReset}
    >
      <FormInput
        label="رقم هاتف الطالب"
        name="missed-tasks-student-phone"
        type="tel"
        inputMode="tel"
        placeholder="ابحث برقم الهاتف"
        value={props.filters.studentPhone}
        onChange={(event) =>
          props.onChange("studentPhone", event.target.value)
        }
      />
      <FormInput
        label="من"
        type="date"
        name="missed-tasks-from"
        value={props.filters.from}
        onChange={(event) => props.onChange("from", event.target.value)}
      />
      <FormInput
        label="إلى"
        type="date"
        name="missed-tasks-to"
        value={props.filters.to}
        onChange={(event) => props.onChange("to", event.target.value)}
      />
      <DropdownField
        label="حالة الحل"
        value={props.filters.status}
        placeholder="كل الحالات"
        items={[
          { label: "كل الحالات", value: "" },
          { label: "محلولة", value: "resolved" },
          { label: "غير محلولة", value: "unresolved" },
        ]}
        onChange={(value) =>
          props.onChange(
            "status",
            value as MissedTasksFiltersState["status"],
          )
        }
      />
      {props.canReadCoaches ? (
        <DropdownField
          label="المدرب"
          value={props.filters.coachId}
          placeholder="كل المدربين"
          items={[{ label: "كل المدربين", value: "" }, ...props.coachOptions]}
          onChange={(value) => props.onChange("coachId", value)}
          loading={props.coachesLoading}
        />
      ) : null}
    </FilterPanel>
  );
}
