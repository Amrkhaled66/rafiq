import DropDownMenu from "@/shared/components/DropDownMenu";

export type SubscriptionEndingFilter = "" | "ending_soon";

type SubscriptionsFiltersProps = {
  endingFilter: SubscriptionEndingFilter;
  onEndingFilterChange: (value: SubscriptionEndingFilter) => void;
};

const ENDING_FILTER_OPTIONS = [
  { label: "كل الاشتراكات", value: "" },
  { label: "تنتهي خلال 7 أيام", value: "ending_soon" },
];

export default function SubscriptionsFilters({
  endingFilter,
  onEndingFilterChange,
}: SubscriptionsFiltersProps) {
  return (
    <section className="dashboard-card">
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
    </section>
  );
}
