import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

import {
  useCancelTaskSession,
  useCompleteTaskSession,
  usePauseTaskSession,
  useResumeTaskSession,
  useStartTaskSession,
} from "@/features/tasks/queries/taskQueries";
import {
  updateTaskDetailSessionCache,
  updateTodayTaskStartedCache,
} from "@/features/tasks/queries/taskSessionCache";
import type {
  TaskDetailStatus,
  TaskSessionItem,
} from "@/features/tasks/types";
import { queryClient } from "@/lib/react-query";

export type SessionTransition =
  | "start"
  | "pause"
  | "resume"
  | "cancel"
  | "complete";

type UseTaskSessionCommandsInput = {
  studentId?: number;
  taskId?: number;
  taskStatus: TaskDetailStatus;
  activeSession: TaskSessionItem | null;
  serverClockOffsetMs: number;
  refetchTaskDetail: () => Promise<unknown>;
};

export function useTaskSessionCommands({
  studentId,
  taskId,
  taskStatus,
  activeSession,
  serverClockOffsetMs,
  refetchTaskDetail,
}: UseTaskSessionCommandsInput) {
  const startMutation = useStartTaskSession(taskId);
  const pauseMutation = usePauseTaskSession();
  const resumeMutation = useResumeTaskSession();
  const cancelMutation = useCancelTaskSession();
  const completeMutation = useCompleteTaskSession();
  const { mutateAsync: startSession } = startMutation;
  const { mutateAsync: pauseSession } = pauseMutation;
  const { mutateAsync: resumeSession } = resumeMutation;
  const { mutateAsync: cancelSession } = cancelMutation;
  const { mutateAsync: completeSession } = completeMutation;
  const [pendingTransition, setPendingTransition] =
    useState<SessionTransition | null>(null);
  const transitionLockRef = useRef(false);

  const runTransition = useCallback(
    async (
      transition: SessionTransition,
      request: () => Promise<TaskSessionItem>,
    ) => {
      if (transitionLockRef.current || !studentId || !taskId) {
        return false;
      }

      transitionLockRef.current = true;
      setPendingTransition(transition);

      try {
        const session = await request();
        updateTaskDetailSessionCache(
          queryClient,
          studentId,
          taskId,
          session,
        );

        if (transition === "start") {
          updateTodayTaskStartedCache(queryClient, studentId, taskId);
        }

        if (transition === "cancel" || transition === "complete") {
          void refetchTaskDetail();
        }

        return true;
      } catch {
        Alert.alert(
          "Session error",
          "Could not update the study session. Please try again.",
        );
        await refetchTaskDetail();
        return false;
      } finally {
        transitionLockRef.current = false;
        setPendingTransition(null);
      }
    },
    [refetchTaskDetail, studentId, taskId],
  );

  const start = useCallback(async () => {
    if (taskStatus === "completed" || activeSession) {
      return false;
    }

    return runTransition("start", startSession);
  }, [activeSession, runTransition, startSession, taskStatus]);

  const pause = useCallback(
    async (elapsedSeconds: number) => {
      if (activeSession?.status !== "running") {
        return false;
      }

      return runTransition("pause", () =>
        pauseSession({
          sessionId: activeSession.id,
          elapsedSeconds,
        }),
      );
    }, [activeSession, pauseSession, runTransition],
  );

  const resume = useCallback(
    async (remainingSeconds: number) => {
      if (activeSession?.status !== "paused") {
        return false;
      }

      const expectedEndAt = new Date(
        Date.now() + serverClockOffsetMs + remainingSeconds * 1000,
      ).toISOString();

      return runTransition("resume", () =>
        resumeSession({
          sessionId: activeSession.id,
          expectedEndAt,
        }),
      );
    }, [
      activeSession,
      resumeSession,
      runTransition,
      serverClockOffsetMs,
    ],
  );

  const cancel = useCallback(async () => {
    if (!activeSession) {
      return false;
    }

    return runTransition("cancel", () =>
      cancelSession(activeSession.id),
    );
  }, [activeSession, cancelSession, runTransition]);

  const complete = useCallback(
    async (sessionId: number) => {
      if (activeSession?.id !== sessionId) {
        return false;
      }

      return runTransition("complete", () =>
        completeSession(sessionId),
      );
    }, [activeSession?.id, completeSession, runTransition],
  );

  return {
    pendingTransition,
    isTransitioning: pendingTransition !== null,
    start,
    pause,
    resume,
    cancel,
    complete,
  };
}
