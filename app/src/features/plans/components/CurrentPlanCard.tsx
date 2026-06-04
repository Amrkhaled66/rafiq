import { ImageBackground, Pressable, View } from "react-native";

import type { StudyPlan } from "@/features/plans/types";
import {
  formatPlanDateRange,
  getPlanStatusAppearance,
  getPlanStatusLabel,
} from "@/features/plans/utils/plan-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

import plansBg from "@assets/images/plans-bg.png";

type CurrentPlanCardProps = {
  plan: StudyPlan;
  onPress?: (plan: StudyPlan) => void;
};

export function CurrentPlanCard({ plan, onPress }: CurrentPlanCardProps) {
  const dir = useDirection();
  const statusAppearance = getPlanStatusAppearance(plan.status);

  return (
    <ImageBackground
      source={plansBg}
      resizeMode="cover"
      className="flex-1"
      imageStyle={{
        width: "100%",
        height: "100%",
        borderRadius: 23,
      }}
    >
      <Pressable
        className="border-card-border border px-4 py-4 active:opacity-90"
        onPress={() => onPress?.(plan)}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        <View className={`items-end  ${dir.rowReverse}`}>
          <View className={`flex-1 gap-6 ${dir.itemsAlign}`}>
            <View
              className={`items-center justify-between gap-2 ${dir.rowReverse}`}
            >
              <AppText className="text-sm" tone="inverse" weight="bold">
                الخطة الحالية
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
              className={`text-lg md:text-xl ${dir.textAlign}`}
              weight="bold"
              numberOfLines={1}
              tone="inverse"
            >
              {plan.name}
            </AppText>

            <AppText
              className={`text-sm md:text-base ${dir.textAlign}`}
              weight="medium"
              tone="inverse"
            >
              {formatPlanDateRange(plan)}
            </AppText>
          </View>
          <View
            className={`items-center justify-center rounded-3xl bg-white px-3 py-2 ${dir.rowReverse}`}
          >
            <AppText
              className="text-brand-primary! my-auto text-sm"
              weight="bold"
            >
              عرض الخطة
            </AppText>
          </View>
        </View>
      </Pressable>
    </ImageBackground>
  );
}
