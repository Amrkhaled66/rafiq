import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getTaskSessions,
  type ListTaskSessionsParams,
} from "@/features/admin/sessions/services/sessionService";

export const taskSessionsQueryKey = ["admin-task-sessions"] as const;

export function useTaskSessionsQuery(params: ListTaskSessionsParams = {}) {
  return useQuery({
    queryKey: [...taskSessionsQueryKey, params],
    queryFn: () => getTaskSessions(params),
    placeholderData: keepPreviousData,
  });
}
