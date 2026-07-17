import { useEffect, useRef } from "react";

import {
  cancelTaskSessionEndNotification,
  scheduleTaskSessionEndNotification,
} from "@/features/tasks/services/taskSessionNotificationService";
import type { TaskSessionItem } from "@/features/tasks/types";

type ScheduledNotification = {
  sessionId: number;
  expectedEndAt: string;
  notificationId: string;
  serverClockOffsetMs: number;
};

type UseSessionNotificationInput = {
  session: TaskSessionItem | null;
  serverClockOffsetMs: number;
};

export function useSessionNotification({
  session,
  serverClockOffsetMs,
}: UseSessionNotificationInput) {
  const scheduledRef = useRef<ScheduledNotification | null>(null);
  const syncVersionRef = useRef(0);

  useEffect(() => {
    const syncVersion = ++syncVersionRef.current;

    const synchronize = async () => {
      const scheduled = scheduledRef.current;
      const shouldSchedule =
        session?.status === "running" && Boolean(session.expectedEndAt);

      if (
        shouldSchedule &&
        scheduled?.sessionId === session.id &&
        scheduled.expectedEndAt === session.expectedEndAt &&
        scheduled.serverClockOffsetMs === serverClockOffsetMs
      ) {
        return;
      }

      if (scheduled) {
        await cancelTaskSessionEndNotification(scheduled.notificationId);
        scheduledRef.current = null;
      }

      if (!shouldSchedule || !session.expectedEndAt) {
        return;
      }

      const notificationId = await scheduleTaskSessionEndNotification(
        session.expectedEndAt,
        serverClockOffsetMs,
      );

      if (syncVersionRef.current !== syncVersion) {
        await cancelTaskSessionEndNotification(notificationId);
        return;
      }

      scheduledRef.current = notificationId
        ? {
            sessionId: session.id,
            expectedEndAt: session.expectedEndAt,
            notificationId,
            serverClockOffsetMs,
          }
        : null;
    };

    void synchronize();
  }, [serverClockOffsetMs, session?.expectedEndAt, session?.id, session?.status]);
}
