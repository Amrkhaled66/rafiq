import { api } from "@/lib/api";

export type Lesson = {
  id: number;
  studentId: number;
  name: string;
  subject: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLessonPayload = {
  name: string;
  subject: string;
  scheduledAt: string;
};

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

export async function listStudentLessons(studentId: number): Promise<Lesson[]> {
  const { data } = await api.get<Lesson[]>(`/students/${studentId}/lessons`);
  return data;
}

export async function createStudentLesson(
  studentId: number,
  payload: CreateLessonPayload,
): Promise<Lesson> {
  const { data } = await api.post<Lesson>(
    `/students/${studentId}/lessons`,
    payload,
  );
  return data;
}

export async function updateStudentLesson(
  studentId: number,
  lessonId: number,
  payload: UpdateLessonPayload,
): Promise<Lesson> {
  const { data } = await api.patch<Lesson>(
    `/students/${studentId}/lessons/${lessonId}`,
    payload,
  );
  return data;
}

export async function deleteStudentLesson(
  studentId: number,
  lessonId: number,
): Promise<{ ok: true }> {
  const { data } = await api.delete<{ ok: true }>(
    `/students/${studentId}/lessons/${lessonId}`,
  );
  return data;
}

