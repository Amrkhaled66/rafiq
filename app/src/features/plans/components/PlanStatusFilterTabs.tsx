import { Pressable, View } from "react-native";

import type { PlanStatusFilterKey } from "@/features/plans/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

const PLAN_STATUS_OPTIONS: { key: PlanStatusFilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "active", label: "نشطة" },
  { key: "upcoming", label: "قادمة" },
  { key: "ended", label: "منتهية" },
];

type PlanStatusFilterTabsProps = {
  value: PlanStatusFilterKey;
  onChange: (value: PlanStatusFilterKey) => void;
};

export function PlanStatusFilterTabs({
  value,
  onChange,
}: PlanStatusFilterTabsProps) {
  const dir = useDirection();

  return (
    <View
      className={`rounded-2xl border border-card-border bg-card p-1.5 ${dir.rowReverse}`}
    >
      {PLAN_STATUS_OPTIONS.map((option) => {
        const isSelected = option.key === value;

        return (
          <Pressable
            key={option.key}
            className={`flex-1 items-center justify-center rounded-2xl px-2 py-3 active:opacity-90 ${
              isSelected ? "bg-brand-primary-soft" : "bg-white"
            }`}
            onPress={() => onChange(option.key)}
          >
            <AppText
              className={`text-sm md:text-base ${
                isSelected ? "text-brand-primary" : "text-text"
              }`}
              tone={isSelected ? "default" : "muted"}
              weight="semibold"
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
