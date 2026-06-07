import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlanDaysCarousel } from "@/features/plans/components/PlanDaysCarousel";
import { PlanDetailHeader } from "@/features/plans/components/PlanDetailHeader";
import { PlanDetailStats } from "@/features/plans/components/PlanDetailStats";
import { PlanDetailTaskCard } from "@/features/plans/components/PlanDetailTaskCard";
import { PlanEmptyDayCard } from "@/features/plans/components/PlanEmptyDayCard";
import { MOCK_PLAN_DETAILS } from "@/features/plans/data/mock-plan-detail-data";
import {
  calculateInclusivePlanDays,
  formatPlanDateRangeFromValues,
  getDefaultSelectedPlanDay,
} from "@/features/plans/utils/plan-ui";
import { AppText } from "@/shared/ui/app-text";

export function PlanDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ planId?: string }>();
  const planId = params.planId ? Number(params.planId) : null;
  // Re-enable this when we switch back to the real backend detail endpoint.
  // const { data, isLoading, isError } = useStudentPlanDetail(planId);
  const data = (planId ? MOCK_PLAN_DETAILS[planId] : null) ?? MOCK_PLAN_DETAILS[1];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.days.length) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate((current) => {
      if (current && data.days.some((day) => day.date === current)) {
        return current;
      }

      return getDefaultSelectedPlanDay(data.days);
    });
  }, [data]);

  const selectedDay = useMemo(
    () => data?.days.find((day) => day.date === selectedDate) ?? null,
    [data, selectedDate],
  );

  // Keep this fallback for when the API query is restored.
  // if (isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-background px-6">
  //       <StatusBar style="dark" />
  //       <AppText className="text-base md:text-lg" tone="muted" weight="medium">
  //         جاري تحميل الخطة...
  //       </AppText>
  //     </View>
  //   );
  // }
  //
  // if (isError || !data) {
  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <StatusBar style="dark" />
        <AppText className="text-lg md:text-xl" weight="bold">
          تعذر تحميل الخطة
        </AppText>
        <AppText
          className="mt-2 text-center text-sm md:text-base"
          tone="muted"
          weight="medium"
        >
          حاول مرة أخرى بعد قليل.
        </AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 45,
          paddingBottom: insets.bottom + 36,
          paddingHorizontal: 18,
        }}
      >
        <View className="gap-5">
          <PlanDetailHeader
            title={data.plan.name}
            dateRangeLabel={formatPlanDateRangeFromValues(
              data.plan.startsOn,
              data.plan.endsOn,
            )}
          />

          <PlanDetailStats
            totalDays={calculateInclusivePlanDays(
              data.plan.startsOn,
              data.plan.endsOn,
            )}
            totalTasks={data.stats.totalTasks}
            progressPercentage={data.stats.progressPercent}
          />

          <PlanDaysCarousel
            days={data.days}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          <View className="gap-2.5">
            {selectedDay?.tasks.length ? (
              selectedDay.tasks.map((task) => (
                <PlanDetailTaskCard key={task.id} task={task} />
              ))
            ) : (
              <PlanEmptyDayCard />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
