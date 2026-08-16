import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import type { ListStudentPlansParams } from "@/features/plans/types";
import {
  getStudentPlanDetail,
  getStudentPlans,
} from "@/features/plans/services/planService";

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
        | ListStudentPlansParams
        | undefined;

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
    queryKey: ["student-plan-detail", user?.id, planId],
    queryFn: () => getStudentPlanDetail(user!.id, planId!),
    enabled: Boolean(user?.id && planId),
  });
}
