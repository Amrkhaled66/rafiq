import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStudentLesson,
  deleteStudentLesson,
  listStudentLessons,
  updateStudentLesson,
  type CreateLessonPayload,
  type UpdateLessonPayload,
} from "@/features/admin/lessons/services/lessonService";

export const studentLessonsQueryKey = ["admin-student-lessons"] as const;

export function useStudentLessonsQuery(studentId: number) {
  return useQuery({
    queryKey: [...studentLessonsQueryKey, studentId],
    queryFn: () => listStudentLessons(studentId),
    enabled: Number.isFinite(studentId) && studentId > 0,
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

