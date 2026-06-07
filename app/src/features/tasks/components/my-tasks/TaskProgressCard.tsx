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
      className="border-card-border bg-card overflow-hidden rounded-3xl border px-4 py-4 md:px-5 md:py-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="bg-brand-primary-soft/50 absolute -top-10 -right-8 h-28 w-28 rounded-full" />
      <View className="bg-brand-primary-soft/30 absolute -bottom-11.25 -left-10 h-28 w-28 rounded-full" />

      <View
        className={`items-center justify-between gap-3 md:gap-4 ${dir.rowReverse}`}
      >
        <View className={`flex-1 gap-1.5 md:gap-2 ${dir.itemsAlign}`}>
          <View className={`items-center gap-2 md:gap-2.5 ${dir.rowReverse}`}>
            <View className="bg-brand-primary-soft h-9 w-9 items-center justify-center rounded-2xl md:h-10 md:w-10">
              <Ionicons
                name="bar-chart-outline"
                size={20}
                color={Colors.light.tint}
              />
            </View>

            <AppText
              className={`text-base md:text-[19px] ${dir.textAlign}`}
              weight="bold"
            >
              تقدمك النهارده
            </AppText>
          </View>

          <AppText
            className={`text-sm md:text-[15px] ${dir.textAlign}`}
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
            className="text-brand-primary text-[32px] leading-[38px] md:text-[36px] md:leading-[42px]"
            weight="bold"
          >
            {progress.percentage}%
          </AppText>
        </View>
      </View>

      <View className="bg-brand-primary-soft mt-3 h-2.5 w-full overflow-hidden rounded-full md:mt-4 md:h-3">
        <View
          className="bg-brand-primary h-full rounded-full"
          style={{ width: `${progress.percentage}%` }}
        />
      </View>

      <View
        className={`mt-3 justify-between gap-2 md:mt-4 md:gap-3 ${dir.rowReverse}`}
      >
        {STATUS_SUMMARY.map((item) => (
          <View key={item.key} className="flex-1 items-center gap-0.5 md:gap-1">
            <View className="flex-row-reverse items-center gap-1 md:gap-1.5">
              <AppText
                className="text-sm md:text-[15px]"
                weight="bold"
                style={{ color: item.color }}
              >
                {statusCounts[item.key]}
              </AppText>

              <Ionicons name={item.icon} size={15} color={item.color} />
            </View>

            <AppText
              className="text-[11px] md:text-[13px]"
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
