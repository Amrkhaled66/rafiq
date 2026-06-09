import type { SubscriptionFilterKey } from "@/features/subscriptions/types";
import { SubscriptionFilterTabsSkeleton } from "@/features/subscriptions/components/skeletons";
import {
  SegmentedFilterTabs,
  type SegmentedFilterOption,
} from "@/shared/ui/segmented-filter-tabs";

const SUBSCRIPTION_STATUS_OPTIONS: SegmentedFilterOption<SubscriptionFilterKey>[] =
  [
    { key: "all", label: "الكل" },
    { key: "active", label: "نشطة" },
    { key: "upcoming", label: "قادمة" },
    { key: "ended", label: "منتهية" },
  ];

type SubscriptionFilterTabsProps = {
  value: SubscriptionFilterKey;
  onChange: (value: SubscriptionFilterKey) => void;
  isLoading?: boolean;
};

export function SubscriptionFilterTabs({
  value,
  onChange,
  isLoading = false,
}: SubscriptionFilterTabsProps) {
  if (isLoading) {
    return <SubscriptionFilterTabsSkeleton />;
  }

  return (
    <SegmentedFilterTabs
      options={SUBSCRIPTION_STATUS_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
