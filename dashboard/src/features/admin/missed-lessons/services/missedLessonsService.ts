import { api } from "@/lib/api";

export type MissedLessonsStats = {
  totalMissed: number;
  totalUnwatched: number;
  totalWatchedLate: number;
  totalResolved: number;
  totalUnresolved: number;
};

export type MissedLessonRow = {
  occurrenceId: number;
  lessonId: number;
  lessonName: string;
  subject: string;
  studentId: number;
  studentName: string;
  scheduledForDate: string;
  scheduledWeekday: string;
  occurrenceStatus: "missed" | "watched_late";
  watchedOn: string | null;
  isResolved: boolean;
  resolvedAt: string | null;
  resolvedByName: string | null;
  resolutionNote: string | null;
  assignedCoaches: Array<{ id: number; name: string }>;
};

export type ListMissedLessonsParams = {
  from?: string;
  to?: string;
  status?: "resolved" | "unresolved";
  watchStatus?: "unwatched" | "watched_late";
  coachId?: number;
  studentPhone?: string;
  page?: number;
  limit?: number;
};

export type MissedLessonsResponse = {
  stats: MissedLessonsStats;
  items: MissedLessonRow[];
  page: number;
  limit: number;
  total: number;
};

export async function getMissedLessons(params: ListMissedLessonsParams = {}) {
  const { data } = await api.get<MissedLessonsResponse>("/missed-lessons", {
    params,
  });
  return data;
}

export async function resolveMissedLesson(occurrenceId: number, note: string) {
  const { data } = await api.patch<{ ok: true }>(
    `/missed-lessons/${occurrenceId}/resolve`,
    { note },
  );
  return data;
}

export async function unresolveMissedLesson(occurrenceId: number) {
  const { data } = await api.delete<{ ok: true }>(
    `/missed-lessons/${occurrenceId}/resolve`,
  );
  return data;
}
