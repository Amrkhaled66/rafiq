import { api } from "@/lib/api";

import type {
  ListStudentPlansParams,
  PlanDetailResponse,
  StudentPlansResponse,
} from "@/features/plans/types";

export async function getStudentPlans(
  studentId: number,
  params: ListStudentPlansParams = {},
): Promise<StudentPlansResponse> {
  const { data } = await api.get<StudentPlansResponse>(
    `/students/${studentId}/plans`,
    { params },
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

export async function markPlanLessonWatched(
  studentId: number,
  occurrenceId: number,
) {
  const { data } = await api.post(
    `/students/${studentId}/lesson-occurrences/${occurrenceId}/watch`,
  );
  return data;
}

export async function unmarkPlanLessonWatched(
  studentId: number,
  occurrenceId: number,
) {
  const { data } = await api.delete(
    `/students/${studentId}/lesson-occurrences/${occurrenceId}/watch`,
  );
  return data;
}
