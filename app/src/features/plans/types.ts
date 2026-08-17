import type Ionicons from "@expo/vector-icons/Ionicons";

export type PlanStatus = "active" | "upcoming" | "ended";
export type PlanStatusFilterKey = "all" | PlanStatus;
export type PlanTaskStatus = "pending" | "in_progress" | "done" | "missed";

export type ListStudentPlansParams = {
  page?: number;
  limit?: number;
  status?: PlanStatus;
};

export type StudentPlanListItem = {
  id: number;
  name: string;
  startsOn: string;
  endsOn: string;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  progressPercent: number;
  status: PlanStatus;
};

export type StudentPlansResponse = {
  student: {
    id: number;
    fullName?: string;
  };
  stats: {
    totalPlans: number;
    activePlans: number;
    completedPlans: number;
    missedTasks: number;
    upcomingTasks: number;
  };
  items: StudentPlanListItem[];
  page: number;
  limit: number;
  total: number;
};

export type StudyPlan = {
  id: number;
  name: string;
  startsOn: string;
  endsOn: string;
  status: PlanStatus;
  icon: keyof typeof Ionicons.glyphMap;
};

export type PlanDetailTask = {
  id: number;
  title: string;
  subject: string;
  status: PlanTaskStatus;
};

export type PlanDetailDay = {
  date: string;
  weekday: string;
  progressPercent: number;
  tasks: PlanDetailTask[];
};

export type PlanLessonOccurrenceStatus =
  "scheduled" | "watched_on_time" | "missed" | "watched_late";

export type PlanDetailLesson = {
  occurrenceId: number;
  lessonId: number;
  name: string;
  subject: string;
  status: PlanLessonOccurrenceStatus;
  watchedOn: string | null;
};

export type PlanDetailLessonDay = {
  date: string;
  weekday: string;
  lessons: PlanDetailLesson[];
};

export type PlanDetailTimelineDay = PlanDetailDay & {
  lessons: PlanDetailLesson[];
};

export type PlanDetailStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  progressPercent: number;
  totalLessons: number;
};

export type PlanDetailResponse = {
  plan: {
    id: number;
    name: string;
    startsOn: string;
    endsOn: string;
    createdAt: string;
    coachId: number;
  };
  stats: PlanDetailStats;
  days: PlanDetailDay[];
  lessonDays: PlanDetailLessonDay[];
};
