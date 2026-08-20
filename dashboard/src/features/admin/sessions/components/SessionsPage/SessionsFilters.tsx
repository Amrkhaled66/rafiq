import FilterPanel from "@/features/admin/shared/components/FilterPanel";
import { SESSION_STATUS_FILTER_OPTIONS } from "@/features/admin/sessions/constants/sessionStatus";
import type { SessionsFiltersState } from "@/features/admin/sessions/hooks/useSessionsFilterParams";
import DropDownMenu from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

type Props = {
  filters: SessionsFiltersState;
  isApplying: boolean;
  hasChanges: boolean;
  hasFilters: boolean;
  onChange: <K extends keyof SessionsFiltersState>(
    key: K,
    value: SessionsFiltersState[K],
  ) => void;
  onApply: () => void;
  onReset: () => void;
};

export default function SessionsFilters(props: Props) {
  return (
    <FilterPanel
      fieldsClassName="grid grid-cols-1 gap-4 md:grid-cols-4"
      isApplying={props.isApplying}
      hasChanges={props.hasChanges}
      hasFilters={props.hasFilters}
      onApply={props.onApply}
      onReset={props.onReset}
    >
      <FormInput
        label="رقم هاتف الطالب"
        name="sessions-student-phone"
        type="tel"
        inputMode="tel"
        placeholder="ابحث برقم الهاتف"
        value={props.filters.studentPhone}
        onChange={(event) =>
          props.onChange("studentPhone", event.target.value)
        }
      />
      <DropDownMenu
        label="الحالة"
        value={props.filters.status}
        placeholder="كل الحالات"
        items={SESSION_STATUS_FILTER_OPTIONS}
        onChange={(value) =>
          props.onChange("status", value as SessionsFiltersState["status"])
        }
      />
      <FormInput
        label="من"
        type="date"
        name="sessions-from"
        value={props.filters.from}
        onChange={(event) => props.onChange("from", event.target.value)}
      />
      <FormInput
        label="إلى"
        type="date"
        name="sessions-to"
        value={props.filters.to}
        onChange={(event) => props.onChange("to", event.target.value)}
      />
    </FilterPanel>
  );
}
