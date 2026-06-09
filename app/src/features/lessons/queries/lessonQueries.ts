import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import {
  getStudentTodayLessons,
  markLessonWatched,
  unmarkLessonWatched,
} from "@/features/lessons/services/lessonService";
import { queryClient } from "@/lib/react-query";

function getTodayLessonsQueryKey(studentId?: number) {
  return ["student-today-lessons", studentId];
}

export function useStudentTodayLessons() {
  const { user } = useAuth();

  return useQuery({
    queryKey: getTodayLessonsQueryKey(user?.id),
    queryFn: () => getStudentTodayLessons(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useMarkLessonWatched() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: (lessonId: number) => markLessonWatched(user!.id, lessonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getTodayLessonsQueryKey(user?.id),
      });
    },
  });
}

export function useUnmarkLessonWatched() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: (lessonId: number) => unmarkLessonWatched(user!.id, lessonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getTodayLessonsQueryKey(user?.id),
      });
    },
  });
}
