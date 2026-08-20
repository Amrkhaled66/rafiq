import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getMissedLessons,
  resolveMissedLesson,
  unresolveMissedLesson,
  type ListMissedLessonsParams,
} from "@/features/admin/missed-lessons/services/missedLessonsService";

export const missedLessonsQueryKey = ["admin-missed-lessons"] as const;

export function useMissedLessonsQuery(
  params: ListMissedLessonsParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: [...missedLessonsQueryKey, params],
    queryFn: () => getMissedLessons(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useResolveMissedLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      occurrenceId,
      note,
    }: {
      occurrenceId: number;
      note: string;
    }) => resolveMissedLesson(occurrenceId, note),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: missedLessonsQueryKey }),
  });
}

export function useUnresolveMissedLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unresolveMissedLesson,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: missedLessonsQueryKey }),
  });
}
