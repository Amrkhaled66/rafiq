import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { PlanDaysCarousel } from "@/features/plans/components/PlanDaysCarousel";
import { PlanDetailHeader } from "@/features/plans/components/PlanDetailHeader";
import { PlanDetailStats } from "@/features/plans/components/PlanDetailStats";
import { PlanEmptyDayCard } from "@/features/plans/components/PlanEmptyDayCard";
import { useStudentPlanDetail } from "@/features/plans/queries/planQueries";
import { PlanCardSkeleton } from "@/features/plans/components/skeletons";
import {
  calculateInclusivePlanDays,
  formatPlanDateRangeFromValues,
  getDefaultSelectedPlanDay,
  getPlanTaskStatusAppearance,
  mapPlanTaskToTaskCard,
} from "@/features/plans/utils/plan-ui";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";
import { TaskCard } from "@/shared/ui/task-card";

export function PlanDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ planId?: string }>();
  const parsedPlanId = params.planId ? Number(params.planId) : null;
  const planId =
    parsedPlanId && Number.isInteger(parsedPlanId) && parsedPlanId > 0
      ? parsedPlanId
      : null;
  const { data, isLoading, isError, refetch } = useStudentPlanDetail(planId);
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

  if (!planId || isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <FocusedStatusBar style="dark" />
        <HomeStateCard
          icon="alert-circle-outline"
          title="تعذر تحميل الخطة"
          description={
            planId
              ? "مش قادرين نعرض تفاصيل الخطة دلوقتي. حاول مرة تانية."
              : "رابط الخطة غير صالح أو رقم الخطة غير موجود."
          }
          actionLabel={planId ? "إعادة المحاولة" : undefined}
          onAction={planId ? () => void refetch() : undefined}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FocusedStatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 45,
          paddingBottom: insets.bottom + 36,
          paddingHorizontal: 18,
        }}
      >
        <View className="gap-5 md:gap-6">
          <PlanDetailHeader
            isLoading={isLoading}
            title={data?.plan.name ?? ""}
            dateRangeLabel={formatPlanDateRangeFromValues(
              data?.plan.startsOn ?? "",
              data?.plan.endsOn ?? "",
            )}
          />

          <PlanDetailStats
            isLoading={isLoading}
            totalDays={calculateInclusivePlanDays(
              data?.plan.startsOn ?? "",
              data?.plan.endsOn ?? "",
            )}
            totalTasks={data?.stats.totalTasks ?? 0}
            progressPercentage={data?.stats.progressPercent ?? 0}
          />

          <PlanDaysCarousel
            isLoading={isLoading}
            days={data?.days ?? []}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          <View className="gap-2.5 md:gap-3">
            {isLoading ? (
              <>
                <PlanCardSkeleton />
                <PlanCardSkeleton />
                <PlanCardSkeleton />
              </>
            ) : selectedDay?.tasks.length ? (
              selectedDay.tasks.map((task) => {
                const taskCardData = mapPlanTaskToTaskCard(task);
                const statusAppearance = getPlanTaskStatusAppearance(task.status);

                return (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    subject={taskCardData.subject}
                    icon={taskCardData.icon}
                    iconBackgroundColor={taskCardData.iconBackgroundColor}
                    iconColor={taskCardData.iconColor}
                    statusLabel={statusAppearance.label}
                    statusBackgroundColor={statusAppearance.backgroundColor}
                    statusTextColor={statusAppearance.textColor}
                    onPress={() => router.push(`/tasks/${task.id}`)}
                  />
                );
              })
            ) : (
              <PlanEmptyDayCard />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
