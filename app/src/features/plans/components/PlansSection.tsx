import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { PlanCard } from "@/features/plans/components/PlanCard";
import type { StudyPlan } from "@/features/plans/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type PlansSectionProps = {
  plans: StudyPlan[];
  onPlanPress?: (plan: StudyPlan) => void;
};

export function PlansSection({ plans, onPlanPress }: PlansSectionProps) {
  const dir = useDirection();

  return (
    <View className="gap-3 md:gap-4">
      <View className={`items-center justify-between ${dir.rowReverse}`}>
        <AppText className="text-lg md:text-[22px]" weight="bold">
          خططي الدراسية
        </AppText>

        <View className="bg-brand-primary-soft rounded-full px-3 py-1 md:px-3.5 md:py-1.5">
          <AppText
            className="text-brand-primary items-center justify-center text-xs md:text-[13px]"
            weight="semibold"
          >
            {plans.length} خطط
          </AppText>
        </View>
      </View>

      <View className="gap-2.5 md:gap-3">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onPress={onPlanPress} />
          ))
        ) : (
          <View
            className="border-card-border bg-card items-center gap-3 rounded-3xl border px-5 py-7 md:gap-3.5 md:px-6 md:py-8"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 1,
            }}
          >
            <View className="bg-brand-primary-soft size-14 items-center justify-center rounded-2xl md:size-15">
              <Ionicons
                name="calendar-outline"
                size={25}
                color={Colors.light.tint}
              />
            </View>

            <View className="items-center gap-1 md:gap-1.5">
              <AppText className="text-base md:text-[19px]" weight="bold">
                لا توجد خطط بعد
              </AppText>

              <AppText
                className="text-center text-sm md:text-[15px]"
                tone="muted"
                weight="medium"
              >
                سيظهر هنا أي خطة يضيفها المدرب لك
              </AppText>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
