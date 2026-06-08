import type { PlanStatusFilterKey } from "@/features/plans/types";
import { PlanStatusFilterTabsSkeleton } from "@/features/plans/components/skeletons";
import {
  SegmentedFilterTabs,
  type SegmentedFilterOption,
} from "@/shared/ui/segmented-filter-tabs";

const PLAN_STATUS_OPTIONS: SegmentedFilterOption<PlanStatusFilterKey>[] = [
  { key: "all", label: "الكل" },
  { key: "active", label: "نشطة" },
  { key: "upcoming", label: "قادمة" },
  { key: "ended", label: "منتهية" },
];

type PlanStatusFilterTabsProps = {
  value: PlanStatusFilterKey;
  onChange: (value: PlanStatusFilterKey) => void;
  isLoading?: boolean;
};

export function PlanStatusFilterTabs({
  value,
  onChange,
  isLoading = false,
}: PlanStatusFilterTabsProps) {
  if (isLoading) {
    return <PlanStatusFilterTabsSkeleton />;
  }

  return (
    <SegmentedFilterTabs
      options={PLAN_STATUS_OPTIONS}
      value={value}
      onChange={onChange}
      selectedClassName="bg-brand-primary-soft"
      selectedTextClassName="text-brand-primary"
      unselectedTextClassName="text-text"
    />
  );
}
