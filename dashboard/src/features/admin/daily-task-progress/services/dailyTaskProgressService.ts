import { api } from "@/lib/api";

export type DailyTaskProgressStatus = "finished" | "unfinished";
export type DailyTaskProgressSort =
  | "studentName"
  | "totalTasks"
  | "completedTasks"
  | "missedTasks";
export type DailyTaskProgressSortOrder = "asc" | "desc";

export type DailyTaskProgressRow = {
  studentId: number;
  studentName: string;
  studentPhone: string;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  completionPercent: number;
};

export type DailyTaskProgressResponse = {
  summary: {
    finishedStudents: number;
    unfinishedStudents: number;
  };
  items: DailyTaskProgressRow[];
  page: number;
  limit: number;
  total: number;
};

export type ListDailyTaskProgressParams = {
  date: string;
  status: DailyTaskProgressStatus;
  page: number;
  limit: number;
  sortBy: DailyTaskProgressSort;
  sortOrder: DailyTaskProgressSortOrder;
};

export async function getDailyTaskProgress(
  params: ListDailyTaskProgressParams,
): Promise<DailyTaskProgressResponse> {
  const { data } = await api.get<DailyTaskProgressResponse>(
    "/daily-task-progress",
    { params },
  );

  return data;
}
