import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import {
  cancelTaskSession,
  completeTaskSession,
  completeStudentTask,
  getStudentTaskDetail,
  getStudentTodayTasks,
  pauseTaskSession,
  resumeTaskSession,
  startTaskSession,
} from "@/features/tasks/services/taskService";
import { queryClient } from "@/lib/react-query";
import {
  getStudentTaskDetailQueryKey,
  getTodayTasksQueryKey,
  updateTaskCompletedCache,
} from "@/features/tasks/queries/taskSessionCache";

export async function invalidateTaskDetail(studentId?: number, taskId?: number) {
  await queryClient.invalidateQueries({
    queryKey: getStudentTaskDetailQueryKey(studentId, taskId),
  });
}

export function useStudentTodayTasks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: getTodayTasksQueryKey(user?.id),
    queryFn: () => getStudentTodayTasks(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useStudentTaskDetail(taskId?: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: getStudentTaskDetailQueryKey(user?.id, taskId),
    queryFn: () => getStudentTaskDetail(user!.id, taskId!),
    enabled: Boolean(user?.id && taskId),
  });
}

export function useStartTaskSession(taskId?: number) {
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => startTaskSession(user!.id, taskId!),
  });
}

export function usePauseTaskSession() {
  return useMutation({
    mutationFn: (input: {
      sessionId: number;
      elapsedSeconds: number;
    }) =>
      pauseTaskSession(input.sessionId, input.elapsedSeconds),
  });
}

export function useResumeTaskSession() {
  return useMutation({
    mutationFn: (input: { sessionId: number; expectedEndAt: string }) =>
      resumeTaskSession(input.sessionId, input.expectedEndAt),
  });
}

export function useCancelTaskSession() {
  return useMutation({
    mutationFn: (sessionId: number) => cancelTaskSession(sessionId),
  });
}

export function useCompleteTaskSession() {
  return useMutation({
    mutationFn: (sessionId: number) => completeTaskSession(sessionId),
  });
}

export function useCompleteStudentTask(taskId?: number) {
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => completeStudentTask(user!.id, taskId!),
    onSuccess: () => {
      if (!user?.id || !taskId) {
        return;
      }

      updateTaskCompletedCache(queryClient, user.id, taskId);
      void queryClient.invalidateQueries({
        queryKey: getStudentTaskDetailQueryKey(user.id, taskId),
      });
      void queryClient.invalidateQueries({
        queryKey: getTodayTasksQueryKey(user.id),
      });
    },
  });
}
