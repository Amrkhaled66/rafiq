import FilterPanel from "@/features/admin/shared/components/FilterPanel";
import type { MissedLessonsFiltersState } from "@/features/admin/missed-lessons/hooks/useMissedLessonsFilterParams";
import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

type Props = {
  filters: MissedLessonsFiltersState;
  showCoach: boolean;
  coachOptions: Array<{ label: string; value: string }>;
  coachesLoading: boolean;
  isApplying: boolean;
  hasChanges: boolean;
  hasFilters: boolean;
  onChange: <K extends keyof MissedLessonsFiltersState>(
    key: K,
    value: MissedLessonsFiltersState[K],
  ) => void;
  onApply: () => void;
  onReset: () => void;
};

export default function MissedLessonsFilters(props: Props) {
  return (
    <FilterPanel
      fieldsClassName="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6"
      isApplying={props.isApplying}
      hasChanges={props.hasChanges}
      hasFilters={props.hasFilters}
      onApply={props.onApply}
      onReset={props.onReset}
    >
      <FormInput
        label="رقم هاتف الطالب"
        name="missed-lessons-student-phone"
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
        name="missed-lessons-from"
        value={props.filters.from}
        onChange={(event) => props.onChange("from", event.target.value)}
      />
      <FormInput
        label="إلى"
        type="date"
        name="missed-lessons-to"
        value={props.filters.to}
        onChange={(event) => props.onChange("to", event.target.value)}
      />
      <DropdownField
        label="حالة المتابعة"
        value={props.filters.status}
        placeholder="كل الحالات"
        items={[
          { label: "كل الحالات", value: "" },
          { label: "تمت المتابعة", value: "resolved" },
          { label: "بحاجة للمتابعة", value: "unresolved" },
        ]}
        onChange={(value) =>
          props.onChange(
            "status",
            value as MissedLessonsFiltersState["status"],
          )
        }
      />
      <DropdownField
        label="حالة المشاهدة"
        value={props.filters.watchStatus}
        placeholder="كل الحالات"
        items={[
          { label: "كل الحالات", value: "" },
          { label: "لم تُشاهد", value: "unwatched" },
          { label: "شوهدت متأخرًا", value: "watched_late" },
        ]}
        onChange={(value) =>
          props.onChange(
            "watchStatus",
            value as MissedLessonsFiltersState["watchStatus"],
          )
        }
      />
      {props.showCoach ? (
        <DropdownField
          label="المدرب"
          value={props.filters.coachId}
          placeholder="كل المدربين"
          items={[{ label: "كل المدربين", value: "" }, ...props.coachOptions]}
          loading={props.coachesLoading}
          onChange={(value) => props.onChange("coachId", value)}
        />
      ) : null}
    </FilterPanel>
  );
}
