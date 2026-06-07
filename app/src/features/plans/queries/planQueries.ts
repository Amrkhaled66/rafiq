import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import type { PlanDetailResponse } from "@/features/plans/types";
import { api } from "@/lib/api";

export async function getStudentPlanDetail(
  studentId: number,
  planId: number,
): Promise<PlanDetailResponse> {
  const { data } = await api.get<PlanDetailResponse>(
    `/students/${studentId}/plans/${planId}`,
  );

  return data;
}

export function useStudentPlanDetail(planId: number | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-plan-detail", user?.id, planId],
    queryFn: () => getStudentPlanDetail(user!.id, planId!),
    enabled: Boolean(user?.id && planId),
  });
}
