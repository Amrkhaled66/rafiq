import { api } from "@/lib/api";

import type { StudentTodayLessonsResponse } from "@/features/tasks/types";

export async function getStudentTodayLessons(
  studentId: number,
): Promise<StudentTodayLessonsResponse> {
  const { data } = await api.get<StudentTodayLessonsResponse>(
    `/students/${studentId}/lessons/today`,
  );

  return data;
}

export async function markLessonWatched(studentId: number, lessonId: number) {
  const { data } = await api.post(
    `/students/${studentId}/lessons/${lessonId}/watch`,
  );

  return data;
}

export async function unmarkLessonWatched(
  studentId: number,
  lessonId: number,
) {
  const { data } = await api.delete(
    `/students/${studentId}/lessons/${lessonId}/watch`,
  );

  return data;
}
