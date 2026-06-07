import type { SubscriptionFilterKey } from "@/features/subscriptions/types";
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
    { key: "cancelled", label: "ملغية" },
  ];

type SubscriptionFilterTabsProps = {
  value: SubscriptionFilterKey;
  onChange: (value: SubscriptionFilterKey) => void;
};

export function SubscriptionFilterTabs({
  value,
  onChange,
}: SubscriptionFilterTabsProps) {
  return (
    <SegmentedFilterTabs
      options={SUBSCRIPTION_STATUS_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
