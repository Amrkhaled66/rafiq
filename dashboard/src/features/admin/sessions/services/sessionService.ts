import { api } from "@/lib/api";

import type { SessionStatus } from "@/features/admin/sessions/constants/sessionStatus";
export type { SessionStatus } from "@/features/admin/sessions/constants/sessionStatus";

export type SessionStats = {
  totalSessions: number;
  runningSessions: number;
  pausedSessions: number;
  completedSessions: number;
  cancelledSessions: number;
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
  durationSeconds: number;
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
