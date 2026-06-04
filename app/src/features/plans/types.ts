import type Ionicons from "@expo/vector-icons/Ionicons";

export type PlanStatus = "active" | "upcoming" | "ended";
export type PlanStatusFilterKey = "all" | PlanStatus;

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
