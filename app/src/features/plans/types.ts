import type Ionicons from "@expo/vector-icons/Ionicons";

export type PlanStatus = "active" | "upcoming" | "ended";
export type PlanStatusFilterKey = "all" | PlanStatus;
export type PlanTaskStatus = "pending" | "in_progress" | "done" | "missed";

export type StudyPlan = {
  id: number;
  name: string;
  studentId: number;
  coachId: number;
  startsOn: string;
  endsOn: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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

export type PlanDetailStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  progressPercent: number;
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
};
