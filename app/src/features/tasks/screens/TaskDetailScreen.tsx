import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_TASK_DETAILS } from "@/features/tasks/data/mock-task-detail-data";
import { FloatingCompleteTaskButton } from "@/features/tasks/components/task-detail/FloatingCompleteTaskButton";
import { PomodoroCard } from "@/features/tasks/components/task-detail/PomodoroCard";
import { TaskDetailHeader } from "@/features/tasks/components/task-detail/TaskDetailHeader";
import { TaskNote } from "@/features/tasks/components/task-detail/TaskNote";
import { TaskSessionsSection } from "@/features/tasks/components/task-detail/TaskSessionsSection";
import { TaskSessionsStatsCard } from "@/features/tasks/components/task-detail/TaskSessionsStatsCard";
import { useTaskPomodoro } from "@/features/tasks/hooks/useTaskPomodoro";
import { AppText } from "@/shared/ui/app-text";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";

export function TaskDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const taskId = params.taskId ?? "t-chemistry";
  const taskDetail = useMemo(
    () => MOCK_TASK_DETAILS[taskId] ?? MOCK_TASK_DETAILS["t-chemistry"],
    [taskId],
  );

  const {
    soundEnabled,
    pomodoroState,
    remainingSeconds,
    totalSeconds,
    sessions,
    stats,
    progress,
    toggleSound,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  } = useTaskPomodoro(taskDetail);

  if (!taskDetail) {
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
      >
        <View className="gap-4 md:gap-5">
          <TaskDetailHeader title={taskDetail.title} />
          <TaskNote note="هنحل من اول سوال 15 لحد سوال 45 في كتاب الامتحان" />

          <PomodoroCard
            taskTitle={taskDetail.title}
            taskStatus={taskDetail.status}
            soundEnabled={soundEnabled}
            pomodoroState={pomodoroState}
            durationSeconds={totalSeconds}
            remainingSeconds={remainingSeconds}
            progress={progress}
            onToggleSound={toggleSound}
            onStart={startSession}
            onPause={pauseSession}
            onResume={resumeSession}
            onStop={stopSession}
          />

          <TaskSessionsStatsCard
            totalFocusMinutes={stats.totalFocusMinutes}
            totalSessions={stats.totalSessions}
            completedSessions={stats.completedSessions}
          />

          <TaskSessionsSection sessions={sessions} />
        </View>
      </ScrollView>

      <FloatingCompleteTaskButton
        disabled={taskDetail.status === "completed"}
        onConfirm={() => {}}
      />
    </View>
  );
}
