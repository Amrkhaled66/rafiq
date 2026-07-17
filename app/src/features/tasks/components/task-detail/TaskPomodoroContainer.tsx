import { useCallback, useEffect, useRef } from "react";

import { PomodoroCard } from "@/features/tasks/components/task-detail/PomodoroCard";
import { useSessionCountdown } from "@/features/tasks/hooks/useSessionCountdown";
import { useSessionNotification } from "@/features/tasks/hooks/useSessionNotification";
import { useTaskSessionCommands } from "@/features/tasks/hooks/useTaskSessionCommands";
import { useTaskSessionReconciliation } from "@/features/tasks/hooks/useTaskSessionReconciliation";
import type {
  TaskDetailStatus,
  TaskSessionItem,
} from "@/features/tasks/types";

type TaskPomodoroContainerProps = {
  studentId?: number;
  taskId?: number;
  taskStatus: TaskDetailStatus;
  activeSession: TaskSessionItem | null;
  focusDurationSeconds: number;
  serverClockOffsetMs: number;
  isLoading: boolean;
  refetchTaskDetail: () => Promise<unknown>;
};

export function TaskPomodoroContainer({
  studentId,
  taskId,
  taskStatus,
  activeSession,
  focusDurationSeconds,
  serverClockOffsetMs,
  isLoading,
  refetchTaskDetail,
}: TaskPomodoroContainerProps) {
  const commands = useTaskSessionCommands({
    studentId,
    taskId,
    taskStatus,
    activeSession,
    serverClockOffsetMs,
    refetchTaskDetail,
  });
  const {
    pendingTransition,
    start,
    pause,
    resume,
    cancel,
    complete,
  } = commands;
  const countdown = useSessionCountdown({
    session: activeSession,
    focusDurationSeconds,
    serverClockOffsetMs,
    pausePending: pendingTransition === "pause",
  });
  const completingSessionIdRef = useRef<number | null>(null);

  useTaskSessionReconciliation({ refetchTaskDetail });
  useSessionNotification({
    session: activeSession,
    serverClockOffsetMs,
  });

  useEffect(() => {
    if (activeSession?.status !== "running") {
      completingSessionIdRef.current = null;
    }
  }, [activeSession?.id, activeSession?.status]);

  useEffect(() => {
    if (
      !countdown.hasExpired ||
      activeSession?.status !== "running" ||
      completingSessionIdRef.current === activeSession.id
    ) {
      return;
    }

    completingSessionIdRef.current = activeSession.id;
    void complete(activeSession.id);
  }, [activeSession?.id, activeSession?.status, complete, countdown.hasExpired]);

  const handlePause = useCallback(async () => {
    const remainingAtTap = countdown.freezeForPause();
    const elapsedAtTap = Math.max(
      0,
      focusDurationSeconds - remainingAtTap,
    );
    const succeeded = await pause(elapsedAtTap);

    if (!succeeded) {
      countdown.releasePauseFreeze();
    }
  }, [countdown, focusDurationSeconds, pause]);

  const handleResume = useCallback(() => {
    void resume(countdown.remainingSeconds);
  }, [countdown.remainingSeconds, resume]);

  const state =
    activeSession?.status === "running"
      ? "running"
      : activeSession?.status === "paused"
        ? "paused"
        : "idle";

  return (
    <PomodoroCard
      isLoading={isLoading}
      taskStatus={taskStatus}
      state={state}
      durationSeconds={focusDurationSeconds}
      remainingSeconds={countdown.remainingSeconds}
      progress={countdown.progress}
      isTransitioning={pendingTransition !== null}
      onStart={() => void start()}
      onPause={() => void handlePause()}
      onResume={handleResume}
      onCancel={() => void cancel()}
    />
  );
}
