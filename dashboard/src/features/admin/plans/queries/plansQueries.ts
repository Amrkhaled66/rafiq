import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeStudentPlanTask,
  createStudentPlan,
  deleteStudentPlan,
  getStudentPlanDetail,
  getStudentPlans,
  type CreateStudentPlanPayload,
  type ListStudentPlansParams,
  updateStudentPlan,
} from "@/features/admin/plans/services/plansService";

export const studentPlansQueryKey = ["admin-student-plans"] as const;
export const studentPlanDetailQueryKey = ["admin-student-plan-detail"] as const;

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

export function useStudentPlanDetailQuery(studentId: number, planId: number) {
  return useQuery({
    queryKey: [...studentPlanDetailQueryKey, studentId, planId],
    queryFn: () => getStudentPlanDetail(studentId, planId),
    enabled:
      Number.isFinite(studentId) &&
      studentId > 0 &&
      Number.isFinite(planId) &&
      planId > 0,
  });
}

export function useUpdateStudentPlanMutation(studentId: number, planId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentPlanPayload) =>
      updateStudentPlan(studentId, planId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...studentPlansQueryKey, studentId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...studentPlanDetailQueryKey, studentId, planId],
        }),
      ]);
    },
  });
}

export function useDeleteStudentPlanMutation(studentId: number, planId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteStudentPlan(studentId, planId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentPlansQueryKey, studentId],
      });
    },
  });
}

export function useCompleteStudentPlanTaskMutation(
  studentId: number,
  planId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) =>
      completeStudentPlanTask(studentId, planId, taskId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...studentPlanDetailQueryKey, studentId, planId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...studentPlansQueryKey, studentId],
        }),
      ]);
    },
  });
}
