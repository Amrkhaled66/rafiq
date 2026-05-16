import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudentPlan,
  getStudentPlans,
  type ListStudentPlansParams,
  type CreateStudentPlanPayload,
} from "@/features/admin/plans/services/plansService";

export const studentPlansQueryKey = ["admin-student-plans"] as const;

export function useStudentPlansQuery(
  studentId: number,
  params: ListStudentPlansParams = {},
) {
  return useQuery({
    queryKey: [...studentPlansQueryKey, studentId, params],
    queryFn: () => getStudentPlans(studentId, params),
    enabled: Number.isFinite(studentId) && studentId > 0,
  });
}

export function useCreateStudentPlanMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentPlanPayload) =>
      createStudentPlan(studentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentPlansQueryKey, studentId],
      });
    },
  });
}
