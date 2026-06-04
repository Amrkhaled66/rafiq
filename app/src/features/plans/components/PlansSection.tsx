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
    <View className="gap-3">
      <View className={`items-center justify-between ${dir.rowReverse}`}>
        <AppText className="text-lg md:text-xl" weight="bold">
          خططي الدراسية
        </AppText>

        <View className="rounded-full bg-brand-primary-soft px-3 py-1">
          <AppText className="text-xs md:text-sm text-brand-primary items-center justify-center " weight="semibold">
            {plans.length} خطط
          </AppText>
        </View>
      </View>

      <View className="gap-2.5">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onPress={onPlanPress} />
          ))
        ) : (
          <View
            className="items-center gap-3 rounded-3xl border border-card-border bg-card px-5 py-7"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View className="size-14 items-center justify-center rounded-2xl bg-brand-primary-soft">
              <Ionicons
                name="calendar-outline"
                size={24}
                color={Colors.light.tint}
              />
            </View>

            <View className="items-center gap-1">
              <AppText className="text-base md:text-lg" weight="bold">
                لا توجد خطط بعد
              </AppText>

              <AppText
                className="text-center text-sm md:text-base"
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
