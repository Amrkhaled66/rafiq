import { Pressable, View } from "react-native";

import type { MyTaskStatus } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

export type TaskStatusFilterKey = "all" | MyTaskStatus;

const STATUS_OPTIONS: { key: TaskStatusFilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "in_progress", label: "قيد التنفيذ" },
  { key: "completed", label: "مكتملة" },
  { key: "not_started", label: "لم تبدأ" },
];

type TaskStatusFilterTabsProps = {
  value: TaskStatusFilterKey;
  onChange: (value: TaskStatusFilterKey) => void;
};

export function TaskStatusFilterTabs({
  value,
  onChange,
}: TaskStatusFilterTabsProps) {
  const dir = useDirection();

  return (
    <View
      className={`border-card-border rounded-2xl  bg-card flex-wrap items-center justify-center gap-2 border ${dir.rowReverse}`}
    >
      {STATUS_OPTIONS.map((option) => {
        const isSelected = option.key === value;

        return (
          <Pressable
            key={option.key}
            className={`flex-1 items-center justify-center rounded-2xl py-3 active:opacity-90 ${
              isSelected ? "border-brand-primary bg-brand-primary" : "bg-white"
            }`}
            onPress={() => onChange(option.key)}
          >
            <AppText
              className={`text-sm md:text-base ${isSelected ? "text-white!" : "text-card-border"}`}
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
