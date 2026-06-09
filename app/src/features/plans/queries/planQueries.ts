import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import {
  getStudentPlanDetail,
  getStudentPlans,
} from "@/features/plans/services/planService";

export function useStudentPlans() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-plans", user?.id],
    queryFn: () => getStudentPlans(user!.id),
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
