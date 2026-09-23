import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStudentLesson,
  deleteStudentLessonOccurrence,
  deleteStudentLesson,
  listStudentLessons,
  listStudentLessonOccurrences,
  updateStudentLessonOccurrence,
  updateStudentLesson,
  type CreateLessonPayload,
  type UpdateLessonPayload,
} from "@/features/admin/lessons/services/lessonService";

export const studentLessonsQueryKey = ["admin-student-lessons"] as const;
export const studentLessonOccurrencesQueryKey = [
  "admin-student-lesson-occurrences",
] as const;

export function useStudentLessonsQuery(studentId: number, enabled = true) {
  return useQuery({
    queryKey: [...studentLessonsQueryKey, studentId],
    queryFn: () => listStudentLessons(studentId),
    enabled: enabled && Number.isFinite(studentId) && studentId > 0,
  });
}

export function useCreateStudentLessonMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLessonPayload) =>
      createStudentLesson(studentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentLessonsQueryKey, studentId],
      });
    },
  });
}

export function useUpdateStudentLessonMutation(
  studentId: number,
  lessonId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLessonPayload) =>
      updateStudentLesson(studentId, lessonId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentLessonsQueryKey, studentId],
      });
    },
  });
}

export function useDeleteStudentLessonMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) => deleteStudentLesson(studentId, lessonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentLessonsQueryKey, studentId],
      });
    },
  });
}

export function useStudentLessonOccurrencesQuery(
  studentId: number,
  params: { from: string; to: string },
  enabled = true,
) {
  return useQuery({
    queryKey: [...studentLessonOccurrencesQueryKey, studentId, params],
    queryFn: () => listStudentLessonOccurrences(studentId, params),
    enabled: enabled && Number.isFinite(studentId) && studentId > 0,
  });
}

export function useUpdateStudentLessonOccurrenceMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { occurrenceId: number; scheduledForDate: string }) =>
      updateStudentLessonOccurrence(studentId, input.occurrenceId, {
        scheduledForDate: input.scheduledForDate,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentLessonOccurrencesQueryKey, studentId],
      });
    },
  });
}

export function useDeleteStudentLessonOccurrenceMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (occurrenceId: number) =>
      deleteStudentLessonOccurrence(studentId, occurrenceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...studentLessonOccurrencesQueryKey, studentId],
      });
    },
  });
}
