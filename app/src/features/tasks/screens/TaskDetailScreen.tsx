import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FloatingCompleteTaskButton } from "@/features/tasks/components/task-detail/FloatingCompleteTaskButton";
import { TaskPomodoroContainer } from "@/features/tasks/components/task-detail/TaskPomodoroContainer";
import { TaskDetailHeader } from "@/features/tasks/components/task-detail/TaskDetailHeader";
import { TaskNote } from "@/features/tasks/components/task-detail/TaskNote";
import { TaskSessionsSection } from "@/features/tasks/components/task-detail/TaskSessionsSection";
import { TaskSessionsStatsCard } from "@/features/tasks/components/task-detail/TaskSessionsStatsCard";
import { useAuth } from "@/features/auth/context/AuthProvider";
import {
  useCompleteStudentTask,
  useStudentTaskDetail,
} from "@/features/tasks/queries/taskQueries";
import { AppText } from "@/shared/ui/app-text";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";

export function TaskDetailScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const params = useLocalSearchParams<{ taskId?: string }>();
  const parsedTaskId = Number(params.taskId);
  const taskId =
    Number.isInteger(parsedTaskId) && parsedTaskId > 0
      ? parsedTaskId
      : undefined;

  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const taskQuery = useStudentTaskDetail(taskId);
  const completeTask = useCompleteStudentTask(taskId);
  const { mutateAsync: completeTaskAsync } = completeTask;
  const { refetch: refetchTaskDetail } = taskQuery;
  const taskDetail = taskQuery.data;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await refetchTaskDetail();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchTaskDetail]);

  const handleCompleteTask = useCallback(async () => {
    try {
      await completeTaskAsync();
      return true;
    } catch {
      Alert.alert(
        "Task error",
        "Could not complete the task. Please try again.",
      );
      return false;
    }
  }, [completeTaskAsync]);

  if (!taskId || taskQuery.isError) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-6">
        <FocusedStatusBar style="dark" />
        <AppText className="text-lg md:text-xl" weight="bold">
          تعذر تحميل المهمة
        </AppText>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <FocusedStatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: insets.bottom + 50,
          paddingHorizontal: 18,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void handleRefresh()}
          />
        }
      >
        <View className="gap-4 md:gap-5">
          <TaskDetailHeader
            isLoading={taskQuery.isLoading}
            title={taskDetail?.title ?? ""}
          />
          <TaskNote
            isLoading={taskQuery.isLoading}
            note="هنحل من اول سؤال 15 لحد سؤال 45 في كتاب الامتحان"
          />

          <TaskPomodoroContainer
            studentId={user?.id}
            taskId={taskId}
            taskStatus={taskDetail?.status ?? "not_started"}
            activeSession={taskDetail?.activeSession ?? null}
            focusDurationSeconds={(taskDetail?.focusDurationMinutes ?? 0) * 60}
            serverClockOffsetMs={taskDetail?.serverClockOffsetMs ?? 0}
            isLoading={taskQuery.isLoading}
            refetchTaskDetail={refetchTaskDetail}
          />

          <TaskSessionsStatsCard
            isLoading={taskQuery.isLoading}
            totalFocusMinutes={taskDetail?.stats.totalFocusMinutes ?? 0}
            totalSessions={taskDetail?.stats.totalSessions ?? 0}
            completedSessions={taskDetail?.stats.completedSessions ?? 0}
          />

          <TaskSessionsSection
            isLoading={taskQuery.isLoading}
            sessions={taskDetail?.sessions ?? []}
          />
        </View>
      </ScrollView>

      {!taskQuery.isLoading && (
        <FloatingCompleteTaskButton
          disabled={
            !taskDetail ||
            taskDetail.status === "completed" ||
            Boolean(taskDetail.activeSession) ||
            taskDetail?.stats.totalSessions === 0
          }
          isSubmitting={completeTask.isPending}
          onConfirm={handleCompleteTask}
        />
      )}
    </View>
  );
}
