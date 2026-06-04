import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import type { MyTaskStatus, MyTasksProgress } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type TaskProgressCardProps = {
  progress: MyTasksProgress;
  statusCounts: Record<MyTaskStatus, number>;
};

const STATUS_SUMMARY: {
  key: MyTaskStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    key: "completed",
    label: "مكتملة",
    icon: "checkmark-circle",
    color: "#16A34A",
  },
  {
    key: "in_progress",
    label: "قيد التنفيذ",
    icon: "time-outline",
    color: Colors.light.tint,
  },
  {
    key: "not_started",
    label: "لم تبدأ",
    icon: "ellipse",
    color: "#F59E0B",
  },
];

export function TaskProgressCard({
  progress,
  statusCounts,
}: TaskProgressCardProps) {
  const dir = useDirection();

  return (
    <View
      className="overflow-hidden rounded-[24px] border border-card-border bg-card px-4 py-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand-primary-soft/50" />
      <View className="absolute bottom-[-45px] -left-10 h-28 w-28 rounded-full bg-brand-primary-soft/30" />

      <View className={`items-center justify-between gap-3 ${dir.rowReverse}`}>
        <View className={`flex-1 gap-1.5 ${dir.itemsAlign}`}>
          <View className={`items-center gap-2 ${dir.rowReverse}`}>
            <View className="h-9 w-9 items-center justify-center rounded-2xl bg-brand-primary-soft">
              <Ionicons
                name="bar-chart-outline"
                size={19}
                color={Colors.light.tint}
              />
            </View>

            <AppText
              className={`text-base md:text-lg ${dir.textAlign}`}
              weight="bold"
            >
              تقدمك النهارده
            </AppText>
          </View>

          <AppText
            className={`text-sm md:text-base ${dir.textAlign}`}
            tone="muted"
            weight="medium"
          >
            أنجزت{" "}
            <AppText className="text-brand-primary" weight="bold">
              {progress.completedCount}
            </AppText>{" "}
            من{" "}
            <AppText className="text-brand-primary" weight="bold">
              {progress.totalCount}
            </AppText>{" "}
            مهام
          </AppText>
        </View>

        <View className="items-center">
          <AppText
            className="text-[32px] leading-[38px] text-brand-primary"
            weight="bold"
          >
            {progress.percentage}%
          </AppText>
        </View>
      </View>

      <View className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-brand-primary-soft">
        <View
          className="h-full rounded-full bg-brand-primary"
          style={{ width: `${progress.percentage}%` }}
        />
      </View>

      <View className={`mt-3 justify-between gap-2 ${dir.rowReverse}`}>
        {STATUS_SUMMARY.map((item) => (
          <View key={item.key} className="flex-1 items-center gap-0.5">
            <View className="flex-row-reverse items-center gap-1">
              <AppText
                className="text-sm"
                weight="bold"
                style={{ color: item.color }}
              >
                {statusCounts[item.key]}
              </AppText>

              <Ionicons name={item.icon} size={14} color={item.color} />
            </View>

            <AppText
              className="text-[11px] md:text-xs"
              tone="muted"
              weight="medium"
              numberOfLines={1}
            >
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
