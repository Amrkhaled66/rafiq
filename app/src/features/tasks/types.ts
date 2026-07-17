import type Ionicons from "@expo/vector-icons/Ionicons";

export type MyTasksDayKey = "yesterday" | "today" | "tomorrow";

export type MyTasksFilterKey = "all" | "tasks" | "lessons";

export type MyTaskStatus = "in_progress" | "completed" | "not_started";

export type MyTaskItem = {
  id: string;
  title: string;
  subject: string;
  estimatedTime?: string;
  status: MyTaskStatus;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor: string;
  iconColor: string;
};

export type MyLessonItem = {
  id: string;
  subject: string;
  icon: keyof typeof Ionicons.glyphMap;
  checked: boolean;
  iconBackgroundColor: string;
  iconColor: string;
};

export type MyTasksProgress = {
  percentage: number;
  completedCount: number;
  totalCount: number;
};

export type MyTasksDayData = {
  dateLabel: string;
  progress: MyTasksProgress;
  tasks: MyTaskItem[];
  lessons: MyLessonItem[];
};

export type TaskApiStatus = "pending" | "in_progress" | "done" | "missed";

export type StudentTodayTasksResponse = {
  dateLabel: string;
  progress: MyTasksProgress;
  statusCounts: Record<MyTaskStatus, number>;
  tasks: {
    id: number;
    title: string;
    subject: string;
    status: TaskApiStatus;
    dueAt: string;
    planId: number;
  }[];
};

export type StudentTodayLessonsResponse = {
  dateLabel: string;
  progress: MyTasksProgress;
  attendedCount: number;
  remainingCount: number;
  lessons: {
    id: number;
    name: string;
    subject: string;
    weekday: string;
    checked: boolean;
    watchedOn: string | null;
  }[];
};

export type TaskDetailStatus = MyTaskStatus;

export type TaskSessionStatus =
  | "running"
  | "completed"
  | "cancelled"
  | "paused";

export type TaskSessionItem = {
  id: number;
  taskId?: number;
  studentId?: number;
  startedAt: string;
  endedAt?: string | null;
  expectedEndAt?: string | null;
  activeSegmentStartedAt?: string | null;
  durationSeconds: number;
  status: TaskSessionStatus;
};

export type TaskSessionStats = {
  totalFocusMinutes: number;
  totalSessions: number;
  completedSessions: number;
};

export type TaskDetailItem = {
  serverNow?: string;
  serverClockOffsetMs?: number;
  id: number;
  title: string;
  subject: string;
  status: TaskDetailStatus;
  focusDurationMinutes: number;
  stats?: TaskSessionStats;
  activeSession?: TaskSessionItem | null;
  sessions: TaskSessionItem[];
};

export type TaskDetailResponse = {
  serverNow: string;
  serverClockOffsetMs: number;
  id: number;
  title: string;
  subject: string;
  status: TaskDetailStatus;
  focusDurationMinutes: number;
  stats: TaskSessionStats;
  activeSession: TaskSessionItem | null;
  sessions: TaskSessionItem[];
};

export type TaskSessionsResponse = {
  items: TaskSessionItem[];
  total: number;
};

export type CompleteStudentTaskResponse = {
  id: number;
  status: "completed";
  completedAt: string;
};
