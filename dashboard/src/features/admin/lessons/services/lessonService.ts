import { api } from "@/lib/api";

export type LessonWeekday =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type Lesson = {
  id: number;
  studentId: number;
  name: string;
  subject: string;
  weekday: LessonWeekday;
  createdAt: string;
  updatedAt: string;
};

export type LessonOccurrenceStatus =
  | "scheduled"
  | "watched_on_time"
  | "missed"
  | "watched_late";

export type LessonOccurrence = {
  id: number;
  lessonId: number;
  lessonName: string;
  currentLessonName: string;
  subject: string;
  scheduledForDate: string;
  scheduledWeekday: LessonWeekday;
  status: LessonOccurrenceStatus;
  watchedOn: string | null;
};

export type CreateLessonPayload = {
  name: string;
  subject: string;
  weekday: LessonWeekday;
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

export async function listStudentLessonOccurrences(
  studentId: number,
  params: { from: string; to: string },
): Promise<LessonOccurrence[]> {
  const { data } = await api.get<LessonOccurrence[]>(
    `/students/${studentId}/lesson-occurrences`,
    { params },
  );
  return data;
}

export async function updateStudentLessonOccurrence(
  studentId: number,
  occurrenceId: number,
  payload: { scheduledForDate: string },
): Promise<LessonOccurrence> {
  const { data } = await api.patch<LessonOccurrence>(
    `/students/${studentId}/lesson-occurrences/${occurrenceId}`,
    payload,
  );
  return data;
}

export async function deleteStudentLessonOccurrence(
  studentId: number,
  occurrenceId: number,
): Promise<{ ok: true }> {
  const { data } = await api.delete<{ ok: true }>(
    `/students/${studentId}/lesson-occurrences/${occurrenceId}`,
  );
  return data;
}
