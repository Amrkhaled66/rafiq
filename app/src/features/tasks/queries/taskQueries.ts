import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { getStudentTodayTasks } from "@/features/tasks/services/taskService";

export function useStudentTodayTasks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-today-tasks", user?.id],
    queryFn: () => getStudentTodayTasks(user!.id),
    enabled: Boolean(user?.id),
  });
}
