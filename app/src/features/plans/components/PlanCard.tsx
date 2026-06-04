import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { StudyPlan } from "@/features/plans/types";
import {
  formatPlanDateRange,
  getPlanStatusAppearance,
  getPlanStatusLabel,
} from "@/features/plans/utils/plan-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type PlanCardProps = {
  plan: StudyPlan;
  onPress?: (plan: StudyPlan) => void;
};

export function PlanCard({ plan, onPress }: PlanCardProps) {
  const dir = useDirection();
  const statusAppearance = getPlanStatusAppearance(plan.status);

  return (
    <Pressable
      className="border-card-border bg-card rounded-3xl border px-4 py-4 active:opacity-90"
      onPress={() => onPress?.(plan)}
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
          style={{ backgroundColor: statusAppearance.iconBackgroundColor }}
        >
          <Ionicons
            name={plan.icon}
            size={24}
            color={statusAppearance.iconColor}
          />
        </View>

        <View className={`flex-1 gap-2 ${dir.itemsAlign}`}>
          <View
            className={`items-center justify-between gap-2 ${dir.rowReverse}`}
          >
            <AppText
              className={`flex-1 text-base md:text-lg ${dir.textAlign}`}
              weight="bold"
              numberOfLines={1}
            >
              {plan.name}
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
                {getPlanStatusLabel(plan.status)}
              </AppText>
            </View>
          </View>

          <AppText
            className={`text-sm md:text-base ${dir.textAlign}`}
            tone="muted"
            weight="medium"
          >
            {formatPlanDateRange(plan)}
          </AppText>
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
