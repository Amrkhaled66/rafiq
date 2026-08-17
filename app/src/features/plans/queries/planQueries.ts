import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import type { ListStudentPlansParams } from "@/features/plans/types";
import {
  getStudentPlanDetail,
  getStudentPlans,
  markPlanLessonWatched,
  unmarkPlanLessonWatched,
} from "@/features/plans/services/planService";
import { queryClient } from "@/lib/react-query";

function getStudentPlanDetailQueryKey(
  studentId?: number,
  planId?: number | null,
) {
  return ["student-plan-detail", studentId, planId];
}

export function useStudentPlans(params: ListStudentPlansParams = {}) {
  const { user } = useAuth();
  const requestParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    status: params.status,
  };

  return useQuery({
    queryKey: ["student-plans", user?.id, requestParams],
    queryFn: () => getStudentPlans(user!.id, requestParams),
    enabled: Boolean(user?.id),
    placeholderData: (previousData, previousQuery) => {
      const previousParams = previousQuery?.queryKey[2] as
        ListStudentPlansParams | undefined;

      return previousParams?.status === requestParams.status
        ? previousData
        : undefined;
    },
  });
}

export function useStudentCurrentPlan() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-plans", user?.id, "current"],
    queryFn: () =>
      getStudentPlans(user!.id, {
        page: 1,
        limit: 1,
        status: "active",
      }),
    enabled: Boolean(user?.id),
  });
}

export function useStudentPlanDetail(planId: number | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: getStudentPlanDetailQueryKey(user?.id, planId),
    queryFn: () => getStudentPlanDetail(user!.id, planId!),
    enabled: Boolean(user?.id && planId),
  });
}

export function usePlanLessonWatchActions(planId: number | null) {
  const { user } = useAuth();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getStudentPlanDetailQueryKey(user?.id, planId),
      }),
      queryClient.invalidateQueries({
        queryKey: ["student-today-lessons", user?.id],
      }),
    ]);
  };

  const markMutation = useMutation({
    mutationFn: (occurrenceId: number) =>
      markPlanLessonWatched(user!.id, occurrenceId),
    onSuccess: invalidate,
  });
  const unmarkMutation = useMutation({
    mutationFn: (occurrenceId: number) =>
      unmarkPlanLessonWatched(user!.id, occurrenceId),
    onSuccess: invalidate,
  });

  return { markMutation, unmarkMutation };
}
