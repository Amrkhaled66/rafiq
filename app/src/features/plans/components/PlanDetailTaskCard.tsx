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
      className="border-card-border bg-card rounded-3xl border px-4 py-3.5 active:opacity-90 md:px-5 md:py-4"
      onPress={() => router.push(`/tasks/${task.id}`)}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className={`items-start gap-3 md:gap-3.5 ${dir.rowReverse}`}>
        <View
          className="size-14 md:size-15 items-center justify-center rounded-2xl"
          style={{ backgroundColor: taskCardData.iconBackgroundColor }}
        >
          <Ionicons
            name={taskCardData.icon}
            size={26}
            color={taskCardData.iconColor}
          />
        </View>

        <View className={`flex-1 gap-2 md:gap-2.5 ${dir.itemsAlign}`}>
          <AppText
            className={`text-base md:text-[19px] ${dir.textAlign}`}
            weight="bold"
            numberOfLines={1}
          >
            {task.title}
          </AppText>

          <View className={`items-center gap-1 ${dir.rowReverse}`}>
            <View className="bg-brand-primary size-1 rounded-full" />
            <AppText
              className="text-sm md:text-[15px]"
              tone="muted"
              weight="medium"
            >
              {taskCardData.subject}
            </AppText>

            <View
              className="rounded-full px-3 py-1 md:px-3.5 md:py-1.5"
              style={{ backgroundColor: statusAppearance.backgroundColor }}
            >
              <AppText
                className="text-[11px] md:text-[13px]"
                weight="semibold"
                style={{ color: statusAppearance.textColor }}
              >
                {statusAppearance.label}
              </AppText>
            </View>
          </View>
        </View>

        <View className="size-9 md:size-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
            size={19}
            color={Colors.light.icon}
          />
        </View>
      </View>
    </Pressable>
  );
}
