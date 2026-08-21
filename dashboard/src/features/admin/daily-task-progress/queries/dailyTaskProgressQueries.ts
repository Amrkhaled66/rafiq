import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getDailyTaskProgress,
  type ListDailyTaskProgressParams,
} from "@/features/admin/daily-task-progress/services/dailyTaskProgressService";

export const dailyTaskProgressQueryKey = ["admin-daily-task-progress"] as const;

export function useDailyTaskProgressQuery(
  params: ListDailyTaskProgressParams,
) {
  return useQuery({
    queryKey: [...dailyTaskProgressQueryKey, params],
    queryFn: () => getDailyTaskProgress(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}
