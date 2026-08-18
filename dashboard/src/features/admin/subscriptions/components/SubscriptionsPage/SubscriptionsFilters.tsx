import DebouncedSearchField from "@/features/admin/shared/components/DebouncedSearchField";
import DropDownMenu from "@/shared/components/DropDownMenu";

export type SubscriptionEndingFilter = "" | "ending_soon";

type SubscriptionsFiltersProps = {
  endingFilter: SubscriptionEndingFilter;
  studentPhone: string;
  onEndingFilterChange: (value: SubscriptionEndingFilter) => void;
  onStudentPhoneChange: (value: string) => void;
};

const ENDING_FILTER_OPTIONS = [
  { label: "كل الاشتراكات", value: "" },
  { label: "تنتهي خلال 7 أيام", value: "ending_soon" },
];

export default function SubscriptionsFilters({
  endingFilter,
  studentPhone,
  onEndingFilterChange,
  onStudentPhoneChange,
}: SubscriptionsFiltersProps) {
  return (
    <section className="dashboard-card">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DebouncedSearchField
          label="رقم هاتف الطالب"
          name="subscriptions-student-phone"
          placeholder="ابحث برقم الهاتف"
          value={studentPhone}
          onChange={onStudentPhoneChange}
        />
        <div className="max-w-sm">
          <DropDownMenu
            label="موعد الانتهاء"
            value={endingFilter}
            placeholder="كل الاشتراكات"
            items={ENDING_FILTER_OPTIONS}
            onChange={(value) =>
              onEndingFilterChange(value as SubscriptionEndingFilter)
            }
          />
        </div>
      </div>
    </section>
  );
}
