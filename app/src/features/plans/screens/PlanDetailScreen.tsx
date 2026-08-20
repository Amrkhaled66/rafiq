import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { PlanDaysCarousel } from "@/features/plans/components/PlanDaysCarousel";
import { PlanDetailHeader } from "@/features/plans/components/PlanDetailHeader";
import { PlanDetailStats } from "@/features/plans/components/PlanDetailStats";
import { PlanEmptyDayCard } from "@/features/plans/components/PlanEmptyDayCard";
import { PlanDaySection } from "@/features/plans/components/PlanDaySection";
import { PlanLessonCard } from "@/features/plans/components/PlanLessonCard";
import {
  usePlanLessonWatchActions,
  useStudentPlanDetail,
} from "@/features/plans/queries/planQueries";
import { PlanCardSkeleton } from "@/features/plans/components/skeletons";
import {
  calculateInclusivePlanDays,
  formatPlanDateRangeFromValues,
  getDefaultSelectedPlanDay,
  getPlanTaskStatusAppearance,
  mapPlanTaskToTaskCard,
  mergePlanTimelineDays,
} from "@/features/plans/utils/plan-ui";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";
import { TaskCard } from "@/shared/ui/task-card";
import { useAppTheme } from "@/shared/theme/appearance-provider";

export function PlanDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ planId?: string }>();
  const parsedPlanId = params.planId ? Number(params.planId) : null;
  const planId =
    parsedPlanId && Number.isInteger(parsedPlanId) && parsedPlanId > 0
      ? parsedPlanId
      : null;
  const { data, isLoading, isError, isRefetching, refetch } =
    useStudentPlanDetail(planId);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [pendingOccurrenceId, setPendingOccurrenceId] = useState<number | null>(
    null,
  );
  const lessonActions = usePlanLessonWatchActions(planId);
  const { colors, effectiveColorScheme } = useAppTheme();
  const statusBarStyle = effectiveColorScheme === "dark" ? "light" : "dark";

  useEffect(() => {
    const timelineDays = data
      ? mergePlanTimelineDays(data.days, data.lessonDays ?? [])
      : [];
    if (!timelineDays.length) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate((current) => {
      if (current && timelineDays.some((day) => day.date === current)) {
        return current;
      }

      return getDefaultSelectedPlanDay(timelineDays);
    });
  }, [data]);

  const timelineDays = useMemo(
    () => (data ? mergePlanTimelineDays(data.days, data.lessonDays ?? []) : []),
    [data],
  );

  const selectedDay = useMemo(
    () => timelineDays.find((day) => day.date === selectedDate) ?? null,
    [timelineDays, selectedDate],
  );

  const handleLessonPress = async (occurrenceId: number, status: string) => {
    if (pendingOccurrenceId) return;
    setPendingOccurrenceId(occurrenceId);
    try {
      if (status === "watched_on_time") {
        await lessonActions.unmarkMutation.mutateAsync(occurrenceId);
      } else {
        await lessonActions.markMutation.mutateAsync(occurrenceId);
      }
    } finally {
      setPendingOccurrenceId(null);
    }
  };

  if (!planId || isError) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-6">
        <FocusedStatusBar style={statusBarStyle} />
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
    <View className="bg-background flex-1">
      <FocusedStatusBar style={statusBarStyle} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => void refetch()}
            tintColor={colors.tint}
            colors={[colors.tint]}
            progressBackgroundColor={colors.card}
            progressViewOffset={30}
          />
        }
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
            totalLessons={data?.stats.totalLessons ?? 0}
            progressPercentage={data?.stats.progressPercent ?? 0}
          />

          <PlanDaysCarousel
            isLoading={isLoading}
            days={timelineDays}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          <View className="gap-5 md:gap-6">
            {isLoading ? (
              <>
                <PlanCardSkeleton />
                <PlanCardSkeleton />
                <PlanCardSkeleton />
              </>
            ) : selectedDay ? (
              <>
                <PlanDaySection
                  title="مهام اليوم"
                  count={selectedDay.tasks.length}
                >
                  {selectedDay.tasks.length ? (
                    selectedDay.tasks.map((task) => {
                      const taskCardData = mapPlanTaskToTaskCard(task);
                      const statusAppearance = getPlanTaskStatusAppearance(
                        task.status,
                        colors,
                      );

                      return (
                        <TaskCard
                          key={task.id}
                          title={task.title}
                          subject={taskCardData.subject}
                          icon={taskCardData.icon}
                          iconBackgroundColor={taskCardData.iconBackgroundColor}
                          iconColor={taskCardData.iconColor}
                          statusLabel={statusAppearance.label}
                          statusBackgroundColor={
                            statusAppearance.backgroundColor
                          }
                          statusTextColor={statusAppearance.textColor}
                          onPress={() => router.push(`/tasks/${task.id}`)}
                        />
                      );
                    })
                  ) : (
                    <PlanEmptyDayCard />
                  )}
                </PlanDaySection>
                <PlanDaySection
                  title="حصص اليوم"
                  count={selectedDay.lessons.length}
                >
                  {selectedDay.lessons.length ? (
                    selectedDay.lessons.map((lesson) => (
                      <PlanLessonCard
                        key={lesson.occurrenceId}
                        lesson={lesson}
                        date={selectedDay.date}
                        isLoading={pendingOccurrenceId === lesson.occurrenceId}
                        onPress={() =>
                          void handleLessonPress(
                            lesson.occurrenceId,
                            lesson.status,
                          )
                        }
                      />
                    ))
                  ) : (
                    <PlanEmptyDayCard message="مفيش حصص مضافة لليوم ده" />
                  )}
                </PlanDaySection>
              </>
            ) : (
              <PlanEmptyDayCard />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
