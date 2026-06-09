import { api } from "@/lib/api";

import type { StudentHomeResponse } from "@/features/home/types";

export async function getStudentHome(
  studentId: number,
): Promise<StudentHomeResponse> {
  const { data } = await api.get<StudentHomeResponse>(`/students/${studentId}/home`);

  return data;
}
