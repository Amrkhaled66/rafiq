import { RelativePathString, router } from "expo-router";
import { useState } from "react";
import { RefreshControl, View } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { TaskProgressCard } from "@/features/tasks/components/my-tasks/TaskProgressCard";
import { TaskSection } from "@/features/tasks/components/my-tasks/TaskSection";
import {
  TaskStatusFilterTabs,
  type TaskStatusFilterKey,
} from "@/features/tasks/components/my-tasks/TaskStatusFilterTabs";
import { useStudentTodayTasks } from "@/features/tasks/queries/taskQueries";
import type { MyTaskItem } from "@/features/tasks/types";
import { mapStudentTodayTasksToViewModel } from "@/features/tasks/utils/taskMappers";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";
import { AppText } from "@/shared/ui/app-text";

export function MyTasksScreen() {
  const [selectedStatus, setSelectedStatus] =
    useState<TaskStatusFilterKey>("all");
  const { data, isLoading, isError, isRefetching, refetch } =
    useStudentTodayTasks();
  const dayData = data ? mapStudentTodayTasksToViewModel(data) : null;

  const visibleTasks = !dayData
    ? []
    : selectedStatus === "all"
      ? dayData.tasks
      : dayData.tasks.filter((task) => task.status === selectedStatus);

  const handleTaskPress = (task: MyTaskItem) => {
    router.push(`/tasks/${task.id}` as RelativePathString);
  };

  if (isError) {
    return (
      <TabPageLayout>
        <View className="gap-4 md:gap-4">
          <PageTitle title="مهامي" />
          <HomeStateCard
            icon="alert-circle-outline"
            title="حصل مشكلة في تحميل المهام"
            description="مش قادرين نعرض مهام النهارده دلوقتي. حاول مرة تانية."
            actionLabel="إعادة المحاولة"
            onAction={() => void refetch()}
          />
        </View>
      </TabPageLayout>
    );
  }

  return (
    <TabPageLayout
      scrollProps={{
        refreshControl: (
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => void refetch()}
          />
        ),
      }}
    >
      <View className="gap-4 md:gap-4">
        <PageTitle title="مهامي" />
        {dayData ? <PageDateBadge dateLabel={dayData.dateLabel} /> : null}
        <TaskProgressCard
          isLoading={isLoading}
          progress={
            dayData?.progress ?? {
              percentage: 0,
              completedCount: 0,
              totalCount: 0,
            }
          }
          statusCounts={
            dayData?.statusCounts ?? {
              completed: 0,
              in_progress: 0,
              not_started: 0,
            }
          }
        />
        {dayData && dayData.tasks.length > 0 ? (
          <>
            <TaskStatusFilterTabs
              isLoading={isLoading}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
            <TaskSection
              isLoading={isLoading}
              tasks={visibleTasks}
              onTaskPress={handleTaskPress}
            />
          </>
        ) : (
          <View className="border-card-border bg-card rounded-3xl border px-4 py-5 md:px-5 md:py-6">
            <AppText
              className="r mx-auto w-fit text-sm md:text-[15px]"
              tone="muted"
              weight="medium"
            >
              مفيش مهمات النهاردة.
            </AppText>
          </View>
        )}
      </View>
    </TabPageLayout>
  );
}
