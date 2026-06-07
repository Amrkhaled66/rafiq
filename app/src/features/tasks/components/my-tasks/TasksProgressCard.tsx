import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import type { MyTasksProgress } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type TasksProgressCardProps = {
  progress: MyTasksProgress;
  itemLabel?: string;
  title?: string;
};

export function TasksProgressCard({
  progress,
  itemLabel = "مهام",
  title = "تقدمك النهارده",
}: TasksProgressCardProps) {
  const dir = useDirection();
  const segmentCount = Math.max(progress.totalCount, 1);
  const segments = Array.from({ length: segmentCount }, (_, index) => index);

  return (
    <View
      className="border-card-border bg-card rounded-3xl border px-4 py-3.5 md:px-5 md:py-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 1,
      }}
    >
      <View className="gap-5">
        <View className={`items-center justify-between ${dir.row}`}>
          <View className="bg-brand-primary-soft h-11 w-11 items-center justify-center rounded-2xl">
            <Ionicons
              name="stats-chart-outline"
              size={20}
              color={Colors.light.tint}
            />
          </View>

          <AppText className="text-base md:text-lg" weight="bold">
            {title}
          </AppText>
        </View>

        <View className={`items-center gap-1.5 ${dir.rowReverse}`}>
          {segments.map((segment) => {
            const isActive = segment < progress.completedCount;

            return (
              <View
                key={segment}
                className="h-2 flex-1 rounded-full"
                style={{
                  backgroundColor: isActive
                    ? Colors.light.tint
                    : Colors.light.soft,
                }}
              />
            );
          })}
        </View>

        <View className={`items-center justify-between ${dir.row}`}>
          <AppText
            className="text-sm md:text-base"
            tone="muted"
            weight="semibold"
          >
            أنجزت{" "}
            <AppText className="text-brand-primary" weight="bold">
              {progress.completedCount}
            </AppText>{" "}
            من{" "}
            <AppText className="text-brand-primary" weight="bold">
              {progress.totalCount}
            </AppText>{" "}
            {itemLabel}
          </AppText>
          <AppText className="text-sm md:text-base" tone="tint" weight="bold">
            {progress.percentage}%
          </AppText>
        </View>
      </View>
    </View>
  );
}
