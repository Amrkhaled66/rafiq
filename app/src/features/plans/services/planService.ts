import { api } from "@/lib/api";

import type {
  PlanDetailResponse,
  StudentPlansResponse,
} from "@/features/plans/types";

export async function getStudentPlans(
  studentId: number,
): Promise<StudentPlansResponse> {
  const { data } = await api.get<StudentPlansResponse>(
    `/students/${studentId}/plans`,
  );

  return data;
}

export async function getStudentPlanDetail(
  studentId: number,
  planId: number,
): Promise<PlanDetailResponse> {
  const { data } = await api.get<PlanDetailResponse>(
    `/students/${studentId}/plans/${planId}`,
  );

  return data;
}
