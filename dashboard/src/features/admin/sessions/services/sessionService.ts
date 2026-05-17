import { api } from "@/lib/api";

export type SessionStatus = "running" | "completed" | "stopped";

export type SessionStats = {
  totalSessions: number;
  runningSessions: number;
  completedSessions: number;
  stoppedSessions: number;
};

export type TaskSessionRow = {
  id: number;
  studentId: number;
  studentName: string;
  taskId: number;
  taskName: string;
  planId: number;
  planName: string;
  startedAt: string;
  endedAt: string | null;
  status: SessionStatus;
};

export type ListTaskSessionsParams = {
  studentPhone?: string;
  status?: SessionStatus;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type TaskSessionsResponse = {
  stats: SessionStats;
  items: TaskSessionRow[];
  page: number;
  limit: number;
  total: number;
};

export async function getTaskSessions(
  params: ListTaskSessionsParams = {},
): Promise<TaskSessionsResponse> {
  const { data } = await api.get<TaskSessionsResponse>("/task-sessions", {
    params,
  });

  return data;
}
