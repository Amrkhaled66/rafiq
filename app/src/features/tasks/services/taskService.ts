import { api } from "@/lib/api";

import type {
  CompleteStudentTaskResponse,
  StudentTodayTasksResponse,
  TaskDetailResponse,
  TaskSessionItem,
  TaskSessionsResponse,
} from "@/features/tasks/types";

export async function getStudentTodayTasks(
  studentId: number,
): Promise<StudentTodayTasksResponse> {
  const { data } = await api.get<StudentTodayTasksResponse>(
    `/students/${studentId}/tasks/today`,
  );

  return data;
}

export async function getStudentTaskDetail(
  studentId: number,
  taskId: number,
): Promise<TaskDetailResponse> {
  const requestStartedAt = Date.now();
  const { data } = await api.get<
    Omit<TaskDetailResponse, "serverClockOffsetMs">
  >(
    `/students/${studentId}/tasks/${taskId}`,
  );
  const responseReceivedAt = Date.now();
  const requestMidpoint =
    requestStartedAt + (responseReceivedAt - requestStartedAt) / 2;

  return {
    ...data,
    serverClockOffsetMs: new Date(data.serverNow).getTime() - requestMidpoint,
  };
}

export async function getStudentTaskSessions(
  studentId: number,
  taskId: number,
): Promise<TaskSessionsResponse> {
  const { data } = await api.get<TaskSessionsResponse>(
    `/students/${studentId}/tasks/${taskId}/sessions`,
  );

  return data;
}

export async function startTaskSession(
  studentId: number,
  taskId: number,
): Promise<TaskSessionItem> {
  const { data } = await api.post<TaskSessionItem>(
    `/students/${studentId}/tasks/${taskId}/sessions`,
  );

  return data;
}

export async function pauseTaskSession(
  sessionId: number,
  elapsedSeconds: number,
): Promise<TaskSessionItem> {
  const { data } = await api.patch<TaskSessionItem>(
    `/task-sessions/${sessionId}/pause`,
    { elapsedSeconds },
  );

  return data;
}

export async function resumeTaskSession(
  sessionId: number,
  expectedEndAt: string,
): Promise<TaskSessionItem> {
  const { data } = await api.patch<TaskSessionItem>(
    `/task-sessions/${sessionId}/resume`,
    { expectedEndAt },
  );

  return data;
}

export async function cancelTaskSession(
  sessionId: number,
): Promise<TaskSessionItem> {
  const { data } = await api.patch<TaskSessionItem>(
    `/task-sessions/${sessionId}/cancel`,
  );

  return data;
}

export async function completeTaskSession(
  sessionId: number,
): Promise<TaskSessionItem> {
  const { data } = await api.patch<TaskSessionItem>(
    `/task-sessions/${sessionId}/complete`,
  );

  return data;
}

export async function completeStudentTask(
  studentId: number,
  taskId: number,
): Promise<CompleteStudentTaskResponse> {
  const { data } = await api.patch<CompleteStudentTaskResponse>(
    `/students/${studentId}/tasks/${taskId}/complete`,
  );

  return data;
}
