export type HomeProgressResponse = {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type HomeTaskResponse = {
  id: number;
  title: string;
  subject: string;
  status: "pending" | "in_progress" | "done" | "missed";
  dueAt: string;
  planId: number;
};

export type HomeLessonResponse = {
  id: number;
  name: string;
  subject: string;
  weekday: string;
  checked: boolean;
  watchedOn: string | null;
};

export type StudentHomeResponse = {
  progress: HomeProgressResponse;
  todayTasks: HomeTaskResponse[];
  todayLessons: HomeLessonResponse[];
};
