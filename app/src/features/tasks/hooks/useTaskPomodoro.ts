import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TaskDetailItem, TaskSessionItem } from "@/features/tasks/types";
import { buildTaskSessionStats } from "@/features/tasks/utils/task-session-ui";

type PomodoroState = "idle" | "running" | "paused";

export function useTaskPomodoro(taskDetail: TaskDetailItem) {
  const focusDurationSeconds = taskDetail.focusDurationMinutes * 60;
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(focusDurationSeconds);
  const [sessions, setSessions] = useState<TaskSessionItem[]>(taskDetail.sessions);
  const activeSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    setSessions(taskDetail.sessions);
    setPomodoroState("idle");
    setRemainingSeconds(taskDetail.focusDurationMinutes * 60);
    activeSessionIdRef.current = null;
  }, [taskDetail]);

  useEffect(() => {
    if (pomodoroState !== "running") {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          clearInterval(interval);
          finishSession();
          return 0;
        }

        const nextValue = current - 1;
        const elapsedSeconds = focusDurationSeconds - nextValue;

        if (activeSessionIdRef.current) {
          setSessions((currentSessions) =>
            currentSessions.map((session) =>
              session.id === activeSessionIdRef.current
                ? {
                    ...session,
                    durationSeconds: elapsedSeconds,
                    status: "running",
                  }
                : session,
            ),
          );
        }

        return nextValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [finishSession, focusDurationSeconds, pomodoroState]);

  const updateActiveSession = useCallback(
    (status: TaskSessionItem["status"], durationSeconds?: number) => {
      if (!activeSessionIdRef.current) {
        return;
      }

      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session.id === activeSessionIdRef.current
            ? {
                ...session,
                durationSeconds:
                  durationSeconds ??
                  focusDurationSeconds - Math.max(remainingSeconds, 0),
                status,
              }
            : session,
        ),
      );
    },
    [focusDurationSeconds, remainingSeconds],
  );

  const finishSession = useCallback(() => {
    setPomodoroState("idle");
    setRemainingSeconds(focusDurationSeconds);
    updateActiveSession("completed", focusDurationSeconds);
    activeSessionIdRef.current = null;
  }, [focusDurationSeconds, updateActiveSession]);

  function startSession() {
    if (taskDetail.status === "completed") {
      return;
    }

    const startedAt = new Date().toISOString();
    const sessionId = `live-${Date.now()}`;
    activeSessionIdRef.current = sessionId;
    setRemainingSeconds(focusDurationSeconds);
    setSessions((currentSessions) => [
      {
        id: sessionId,
        startedAt,
        durationSeconds: 0,
        status: "running",
      },
      ...currentSessions,
    ]);
    setPomodoroState("running");
  }

  function pauseSession() {
    if (pomodoroState !== "running") {
      return;
    }

    setPomodoroState("paused");
    updateActiveSession("paused");
  }

  function resumeSession() {
    if (pomodoroState !== "paused") {
      return;
    }

    setPomodoroState("running");
    updateActiveSession("running");
  }

  function stopSession() {
    if (pomodoroState === "idle") {
      return;
    }

    setPomodoroState("idle");
    setRemainingSeconds(focusDurationSeconds);
    updateActiveSession("cancelled");
    activeSessionIdRef.current = null;
  }

  const stats = useMemo(() => buildTaskSessionStats(sessions), [sessions]);
  const progress =
    focusDurationSeconds > 0
      ? (focusDurationSeconds - remainingSeconds) / focusDurationSeconds
      : 0;

  return {
    soundEnabled,
    pomodoroState,
    remainingSeconds,
    totalSeconds: focusDurationSeconds,
    sessions,
    stats,
    progress,
    canStart: taskDetail.status !== "completed",
    toggleSound: () => setSoundEnabled((current) => !current),
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  };
}
