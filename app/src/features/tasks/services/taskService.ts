import { api } from "@/lib/api";

import type { StudentTodayTasksResponse } from "@/features/tasks/types";

export async function getStudentTodayTasks(
  studentId: number,
): Promise<StudentTodayTasksResponse> {
  const { data } = await api.get<StudentTodayTasksResponse>(
    `/students/${studentId}/tasks/today`,
  );

  return data;
}
