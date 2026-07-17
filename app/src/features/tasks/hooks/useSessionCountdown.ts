import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TaskSessionItem } from "@/features/tasks/types";

function resolveRemainingSeconds(
  session: TaskSessionItem | null,
  focusDurationSeconds: number,
  serverClockOffsetMs: number,
) {
  if (!session) {
    return focusDurationSeconds;
  }

  if (session.status === "running" && session.expectedEndAt) {
    const expectedEndAt = new Date(session.expectedEndAt).getTime();

    if (!Number.isNaN(expectedEndAt)) {
      return Math.max(
        0,
        Math.ceil(
          (expectedEndAt - (Date.now() + serverClockOffsetMs)) / 1000,
        ),
      );
    }
  }

  if (session.status === "paused") {
    return Math.max(0, focusDurationSeconds - session.durationSeconds);
  }

  return session.status === "running" ? focusDurationSeconds : 0;
}

type UseSessionCountdownInput = {
  session: TaskSessionItem | null;
  focusDurationSeconds: number;
  serverClockOffsetMs: number;
  pausePending: boolean;
};

export function useSessionCountdown({
  session,
  focusDurationSeconds,
  serverClockOffsetMs,
  pausePending,
}: UseSessionCountdownInput) {
  const calculateRemaining = useCallback(
    () =>
      resolveRemainingSeconds(
        session,
        focusDurationSeconds,
        serverClockOffsetMs,
      ),
    [focusDurationSeconds, serverClockOffsetMs, session],
  );
  const [remainingSeconds, setRemainingSeconds] = useState(calculateRemaining);
  const [frozenSeconds, setFrozenSeconds] = useState<number | null>(null);
  const remainingSecondsRef = useRef(remainingSeconds);

  useEffect(() => {
    remainingSecondsRef.current = remainingSeconds;
  }, [remainingSeconds]);

  useEffect(() => {
    if (pausePending) {
      return;
    }

    const nextRemaining = calculateRemaining();
    remainingSecondsRef.current = nextRemaining;
    setFrozenSeconds(null);
    setRemainingSeconds(nextRemaining);
  }, [calculateRemaining, pausePending]);

  useEffect(() => {
    if (session?.status !== "running" || pausePending) {
      return;
    }

    const updateCountdown = () => {
      const nextRemaining = calculateRemaining();
      remainingSecondsRef.current = nextRemaining;
      setRemainingSeconds(nextRemaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [calculateRemaining, pausePending, session?.status]);

  const freezeForPause = useCallback(() => {
    const snapshot = remainingSecondsRef.current;
    setFrozenSeconds(snapshot);
    return snapshot;
  }, []);

  const releasePauseFreeze = useCallback(() => {
    setFrozenSeconds(null);
    const nextRemaining = calculateRemaining();
    remainingSecondsRef.current = nextRemaining;
    setRemainingSeconds(nextRemaining);
  }, [calculateRemaining]);

  const displayedRemainingSeconds = frozenSeconds ?? remainingSeconds;
  const progress = useMemo(() => {
    if (focusDurationSeconds <= 0) {
      return 0;
    }

    return Math.min(
      1,
      Math.max(
        0,
        (focusDurationSeconds - displayedRemainingSeconds) /
          focusDurationSeconds,
      ),
    );
  }, [displayedRemainingSeconds, focusDurationSeconds]);

  return {
    remainingSeconds: displayedRemainingSeconds,
    elapsedSeconds: Math.max(
      0,
      focusDurationSeconds - displayedRemainingSeconds,
    ),
    progress,
    hasExpired:
      session?.status === "running" && displayedRemainingSeconds === 0,
    freezeForPause,
    releasePauseFreeze,
  };
}
