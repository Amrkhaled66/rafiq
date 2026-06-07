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
      className="border-card-border bg-card rounded-3xl border px-4 py-4 active:opacity-90 md:px-5 md:py-4.5"
      onPress={() => onPress?.(plan)}
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
          style={{ backgroundColor: statusAppearance.iconBackgroundColor }}
        >
          <Ionicons
            name={plan.icon}
            size={25}
            color={statusAppearance.iconColor}
          />
        </View>

        <View className={`flex-1 gap-2 md:gap-2.5 ${dir.itemsAlign}`}>
          <View
            className={`items-center justify-between gap-2 md:gap-2.5 ${dir.rowReverse}`}
          >
            <AppText
              className={`flex-1 text-base md:text-[19px] ${dir.textAlign}`}
              weight="bold"
              numberOfLines={1}
            >
              {plan.name}
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
                {getPlanStatusLabel(plan.status)}
              </AppText>
            </View>
          </View>

          <AppText
            className={`text-sm md:text-[15px] ${dir.textAlign}`}
            tone="muted"
            weight="medium"
          >
            {formatPlanDateRange(plan)}
          </AppText>
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
