import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

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
  parentHorizontalPadding?: number; // pass the parent's px value here
};

export function PlanDaysCarousel({
  days,
  selectedDate,
  onSelect,
  parentHorizontalPadding = 16,
}: PlanDaysCarouselProps) {
  const dir = useDirection();
  const orderedDays = useMemo(
    () => [...days].sort((left, right) => left.date.localeCompare(right.date)),
    [days],
  );

  return (
    <View className="gap-3">
      <AppText className="text-lg md:text-xl" weight="bold">
        أيام الخطة
      </AppText>

      {/* Negative margin to escape parent padding, then restore with contentContainerStyle */}
      <View
        style={{
          marginHorizontal: -parentHorizontalPadding,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // 1. RTL: tell ScrollView that content starts from the right
          style={{
            flexDirection: dir.isRTL ? "row-reverse" : "row",
          }}
          contentContainerStyle={{
            gap: 4,
            // 2. Restore the edge padding so cards don't stick to screen edges
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
                className="rounded-3xl  px-3 py-4 active:opacity-90"
                onPress={() => onSelect(day.date)}
                style={{
                  backgroundColor: isSelected ? "#D00507" : "#FFFFFF",
                  borderColor: isSelected
                    ? "#D00507"
                    : "rgba(208, 5, 7, 0.12)",
                  borderWidth: 1,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.08 : 0.04,
                  shadowRadius: 10,
                  elevation: 2,
                }}
              >
                <View className={`gap-2 ${dir.itemsAlign}`}>
                  <AppText
                    className={`text-sm ${dir.textAlign} mx-auto shrink flex-wrap`}
                    tone={isSelected ? "inverse" : "default"}
                    weight="bold"
                  >
                    {getArabicPlanDayLabel(dayOrder)}
                  </AppText>
                  <View className="w-full">
                    <AppText
                      className={`mx-auto text-2xl ${dir.textAlign}`}
                      tone={isSelected ? "inverse" : "default"}
                      weight="bold"
                      numberOfLines={1}
                    >
                      {getDayNumber(day.date)}
                    </AppText>
                    <AppText
                      className={`mx-auto text-sm ${dir.textAlign}`}
                      tone={isSelected ? "inverse" : "muted"}
                      weight="semibold"
                    >
                      {`${getDayMonthName(day.date)}`}
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