import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMissedTasks,
  resolveMissedTask,
  unresolveMissedTask,
  type ListMissedTasksParams,
} from "@/features/admin/missed-tasks/services/missedTasksService";

export const missedTasksQueryKey = ["admin-missed-tasks"] as const;

export function useMissedTasksQuery(params: ListMissedTasksParams = {}) {
  return useQuery({
    queryKey: [...missedTasksQueryKey, params],
    queryFn: () => getMissedTasks(params),
  });
}

export function useResolveMissedTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, note }: { taskId: number; note: string }) =>
      resolveMissedTask(taskId, { note }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: missedTasksQueryKey });
    },
  });
}

export function useUnresolveMissedTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => unresolveMissedTask(taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: missedTasksQueryKey });
    },
  });
}
