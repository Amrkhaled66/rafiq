import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { PlanDaysCarouselSkeleton } from "@/features/plans/components/skeletons";
import type { PlanDetailDay } from "@/features/plans/types";
import {
  getArabicPlanDayLabel,
  getDayMonthName,
  getDayNumber,
} from "@/features/plans/utils/plan-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type PlanDaysCarouselProps = {
  days: PlanDetailDay[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
  parentHorizontalPadding?: number;
  isLoading?: boolean;
};

export function PlanDaysCarousel({
  days,
  selectedDate,
  onSelect,
  parentHorizontalPadding = 16,
  isLoading = false,
}: PlanDaysCarouselProps) {
  const dir = useDirection();
  const orderedDays = useMemo(
    () => [...days].sort((left, right) => left.date.localeCompare(right.date)),
    [days],
  );

  if (isLoading) {
    return <PlanDaysCarouselSkeleton />;
  }

  return (
    <View className="gap-3 md:gap-4">
      <AppText className="text-lg md:text-[22px]" weight="bold">
        أيام الخطة
      </AppText>

      <View
        style={{
          marginHorizontal: -parentHorizontalPadding,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: dir.isRTL ? "row-reverse" : "row",
          }}
          contentContainerStyle={{
            gap: 6,
            paddingHorizontal: parentHorizontalPadding,
            flexDirection: dir.isRTL ? "row-reverse" : "row",
          }}
        >
          {orderedDays.map((day, index) => {
            const isSelected = day.date === selectedDate;
            const dayOrder = index + 1;

            return (
              <Pressable
                key={day.date}
                className="rounded-3xl px-3 py-4 active:opacity-90 md:px-4 md:py-5"
                onPress={() => onSelect(day.date)}
                style={{
                  backgroundColor: isSelected ? "#D00507" : "#FFFFFF",
                  borderColor: isSelected ? "#D00507" : "rgba(208, 5, 7, 0.12)",
                  borderWidth: 1,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.08 : 0.04,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <View className={`gap-2 md:gap-2.5 ${dir.itemsAlign}`}>
                  <AppText
                    className={`mx-auto shrink flex-wrap text-sm md:text-[15px] ${dir.textAlign}`}
                    tone={isSelected ? "inverse" : "default"}
                    weight="bold"
                  >
                    {getArabicPlanDayLabel(dayOrder)}
                  </AppText>
                  <View className="w-full">
                    <AppText
                      className={`mx-auto text-2xl md:text-[28px] ${dir.textAlign}`}
                      tone={isSelected ? "inverse" : "default"}
                      weight="bold"
                      numberOfLines={1}
                    >
                      {getDayNumber(day.date)}
                    </AppText>
                    <AppText
                      className={`mx-auto text-sm md:text-[15px] ${dir.textAlign}`}
                      tone={isSelected ? "inverse" : "muted"}
                      weight="semibold"
                    >
                      {getDayMonthName(day.date)}
                    </AppText>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
