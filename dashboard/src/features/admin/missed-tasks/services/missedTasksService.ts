import { api } from "@/lib/api";

export type MissedTasksStats = {
  totalMissed: number;
  totalResolved: number;
  totalUnresolved: number;
};

export type MissedTaskRow = {
  taskId: number;
  taskName: string;
  subject: string;
  studentId: number;
  studentName: string;
  planId: number;
  planName: string;
  coachId: number;
  coachName: string;
  dueAt: string;
  status: string;
  isResolved: boolean;
  resolvedAt?: string | null;
  resolvedByName?: string | null;
  resolutionNote?: string | null;
};

export type ListMissedTasksParams = {
  from?: string;
  to?: string;
  status?: "resolved" | "unresolved";
  coachId?: number;
  page?: number;
  limit?: number;
};

export type MissedTasksResponse = {
  stats: MissedTasksStats;
  items: MissedTaskRow[];
  page: number;
  limit: number;
  total: number;
};

export async function getMissedTasks(
  params: ListMissedTasksParams = {},
): Promise<MissedTasksResponse> {
  const { data } = await api.get<MissedTasksResponse>("/missed-tasks", {
    params,
  });

  return data;
}

export async function resolveMissedTask(
  taskId: number,
  payload: { note: string },
): Promise<{ ok: true }> {
  const { data } = await api.patch<{ ok: true }>(
    `/missed-tasks/${taskId}/resolve`,
    payload,
  );

  return data;
}

export async function unresolveMissedTask(
  taskId: number,
): Promise<{ ok: true }> {
  const { data } = await api.delete<{ ok: true }>(
    `/missed-tasks/${taskId}/resolve`,
  );

  return data;
}
