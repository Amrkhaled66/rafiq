import type { QueryClient } from "@tanstack/react-query";

import type {
  StudentTodayTasksResponse,
  TaskDetailResponse,
  TaskSessionItem,
} from "@/features/tasks/types";

export function getTodayTasksQueryKey(studentId?: number) {
  return ["student-today-tasks", studentId] as const;
}

export function getStudentTaskDetailQueryKey(
  studentId?: number,
  taskId?: number,
) {
  return ["student-task-detail", studentId, taskId] as const;
}

export function mergeTaskSession(
  detail: TaskDetailResponse,
  session: TaskSessionItem,
): TaskDetailResponse {
  const sessionExists = detail.sessions.some((item) => item.id === session.id);
  const sessions = sessionExists
    ? detail.sessions.map((item) => (item.id === session.id ? session : item))
    : [session, ...detail.sessions];
  const isActive = session.status === "running" || session.status === "paused";

  return {
    ...detail,
    status:
      detail.status === "not_started" && isActive
        ? "in_progress"
        : detail.status,
    activeSession: isActive
      ? session
      : detail.activeSession?.id === session.id
        ? null
        : detail.activeSession,
    sessions,
  };
}

export function updateTaskDetailSessionCache(
  queryClient: QueryClient,
  studentId: number,
  taskId: number,
  session: TaskSessionItem,
) {
  queryClient.setQueryData<TaskDetailResponse>(
    getStudentTaskDetailQueryKey(studentId, taskId),
    (detail) => (detail ? mergeTaskSession(detail, session) : detail),
  );
}

export function updateTodayTaskStartedCache(
  queryClient: QueryClient,
  studentId: number,
  taskId: number,
) {
  queryClient.setQueryData<StudentTodayTasksResponse>(
    getTodayTasksQueryKey(studentId),
    (response) => {
      if (!response) {
        return response;
      }

      const previousTask = response.tasks.find((task) => task.id === taskId);

      if (!previousTask || previousTask.status === "in_progress") {
        return response;
      }

      return {
        ...response,
        statusCounts: {
          ...response.statusCounts,
          not_started: Math.max(0, response.statusCounts.not_started - 1),
          in_progress: response.statusCounts.in_progress + 1,
        },
        tasks: response.tasks.map((task) =>
          task.id === taskId ? { ...task, status: "in_progress" } : task,
        ),
      };
    },
  );
}

export function updateTaskCompletedCache(
  queryClient: QueryClient,
  studentId: number,
  taskId: number,
) {
  queryClient.setQueryData<TaskDetailResponse>(
    getStudentTaskDetailQueryKey(studentId, taskId),
    (detail) => (detail ? { ...detail, status: "completed" } : detail),
  );

  queryClient.setQueryData<StudentTodayTasksResponse>(
    getTodayTasksQueryKey(studentId),
    (response) => {
      if (!response) {
        return response;
      }

      const task = response.tasks.find((item) => item.id === taskId);

      if (!task || task.status === "done") {
        return response;
      }

      const completedCount = response.progress.completedCount + 1;
      const totalCount = response.progress.totalCount;
      const previousStatus =
        task.status === "in_progress" ? "in_progress" : "not_started";

      return {
        ...response,
        progress: {
          ...response.progress,
          completedCount,
          percentage:
            totalCount === 0
              ? 0
              : Math.round((completedCount / totalCount) * 100),
        },
        statusCounts: {
          ...response.statusCounts,
          [previousStatus]: Math.max(
            0,
            response.statusCounts[previousStatus] - 1,
          ),
          completed: response.statusCounts.completed + 1,
        },
        tasks: response.tasks.map((item) =>
          item.id === taskId ? { ...item, status: "done" as const } : item,
        ),
      };
    },
  );
}
