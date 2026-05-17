import { useQuery } from "@tanstack/react-query";

import { getMissedTasks } from "@/features/admin/missed-tasks/services/missedTasksService";
import { getTaskSessions } from "@/features/admin/sessions/services/sessionService";
import { listSubscriptions } from "@/features/admin/subscriptions/services/subscriptionService";
import { formatDateLocal } from "@/shared/utils/dates";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const dashboardHomeQueryKey = ["admin-dashboard-home"] as const;

export function useDashboardHomeQueries(input: { isSuperAdmin: boolean }) {
  const today = new Date();
  const todayStr = formatDateLocal(today);
  const from30Str = formatDateLocal(addDays(today, -30));
  const from7Str = formatDateLocal(addDays(today, -7));

  const missedUnresolved = useQuery({
    queryKey: [...dashboardHomeQueryKey, "missed-unresolved", todayStr],
    queryFn: () =>
      getMissedTasks({
        status: "unresolved",
        from: from30Str,
        to: todayStr,
        page: 1,
        limit: 10,
      }),
  });

  const missedResolvedRecent = useQuery({
    queryKey: [...dashboardHomeQueryKey, "missed-resolved", todayStr],
    queryFn: () =>
      getMissedTasks({
        status: "resolved",
        from: from7Str,
        to: todayStr,
        page: 1,
        limit: 10,
      }),
  });

  const runningSessions = useQuery({
    queryKey: [...dashboardHomeQueryKey, "sessions-running", todayStr],
    queryFn: () =>
      getTaskSessions({
        status: "running",
        page: 1,
        limit: 10,
      }),
  });

  const subscriptions = useQuery({
    queryKey: [...dashboardHomeQueryKey, "subscriptions", todayStr],
    queryFn: () =>
      listSubscriptions({
        page: 1,
        limit: 50,
      }),
    enabled: input.isSuperAdmin,
  });

  return {
    today,
    missedUnresolved,
    missedResolvedRecent,
    runningSessions,
    subscriptions,
  };
}

