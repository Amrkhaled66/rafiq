import type Ionicons from "@expo/vector-icons/Ionicons";

export type MyTasksDayKey = "yesterday" | "today" | "tomorrow";

export type MyTasksFilterKey = "all" | "tasks" | "lessons";

export type MyTaskStatus = "in_progress" | "completed" | "not_started";

export type MyTaskItem = {
  id: string;
  title: string;
  subject: string;
  estimatedTime: string;
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

export type TaskDetailStatus = MyTaskStatus;

export type TaskSessionStatus =
  | "running"
  | "completed"
  | "cancelled"
  | "paused";

export type TaskSessionItem = {
  id: string;
  startedAt: string;
  durationSeconds: number;
  status: TaskSessionStatus;
};

export type TaskDetailItem = {
  id: string;
  title: string;
  subject: string;
  status: TaskDetailStatus;
  focusDurationMinutes: number;
  sessions: TaskSessionItem[];
};
