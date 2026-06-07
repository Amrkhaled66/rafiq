import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

import type { PlanDetailTask } from "@/features/plans/types";
import {
  getPlanTaskStatusAppearance,
  mapPlanTaskToTaskCard,
} from "@/features/plans/utils/plan-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type PlanDetailTaskCardProps = {
  task: PlanDetailTask;
};

export function PlanDetailTaskCard({ task }: PlanDetailTaskCardProps) {
  const dir = useDirection();
  const statusAppearance = getPlanTaskStatusAppearance(task.status);
  const taskCardData = mapPlanTaskToTaskCard(task);

  return (
    <Pressable
      className="rounded-3xl border border-card-border bg-card px-4 py-3.5 active:opacity-90"
      onPress={() => router.push(`/tasks/${task.id}`)}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className={`items-start gap-3 ${dir.rowReverse}`}>
        <View
          className="size-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: taskCardData.iconBackgroundColor }}
        >
          <Ionicons
            name={taskCardData.icon}
            size={25}
            color={taskCardData.iconColor}
          />
        </View>

        <View className={`flex-1 gap-2 ${dir.itemsAlign}`}>
          <AppText
            className={`text-base md:text-lg ${dir.textAlign}`}
            weight="bold"
            numberOfLines={1}
          >
            {task.title}
          </AppText>

          <View className={`items-center gap-1 ${dir.rowReverse}`}>
            <View className="size-1 rounded-full bg-brand-primary" />
            <AppText
              className="text-sm md:text-base"
              tone="muted"
              weight="medium"
            >
              {taskCardData.subject}
            </AppText>

            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: statusAppearance.backgroundColor }}
            >
              <AppText
                className="text-[11px] md:text-xs"
                weight="semibold"
                style={{ color: statusAppearance.textColor }}
              >
                {statusAppearance.label}
              </AppText>
            </View>
          </View>
        </View>

        <View className="size-9 items-center justify-center rounded-full bg-gray-50">
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color={Colors.light.icon}
          />
        </View>
      </View>
    </Pressable>
  );
}
