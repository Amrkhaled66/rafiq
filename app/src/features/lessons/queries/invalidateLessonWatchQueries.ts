import { queryClient } from "@/lib/react-query";

export async function invalidateLessonWatchQueries(studentId?: number) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["student-home", studentId],
    }),
    queryClient.invalidateQueries({
      queryKey: ["student-today-lessons", studentId],
    }),
    queryClient.invalidateQueries({
      queryKey: ["student-plan-detail", studentId],
    }),
  ]);
}
