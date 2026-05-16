import { api } from "@/lib/api";
import type { Student } from "@/features/admin/students/services/studentService";

export type StudentPlansStats = {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  missedTasks: number;
  upcomingTasks: number;
};

export type StudentPlanRow = {
  id: number;
  name: string;
  startsOn: string;
  endsOn: string;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  progressPercent: number;
};

export type StudentPlansResponse = {
  student: Student;
  stats: StudentPlansStats;
  items: StudentPlanRow[];
  page: number;
  limit: number;
  total: number;
};

export type ListStudentPlansParams = {
  page?: number;
  limit?: number;
};

export async function getStudentPlans(
  studentId: number,
  params: ListStudentPlansParams = {},
): Promise<StudentPlansResponse> {
  const { data } = await api.get<StudentPlansResponse>(
    `/students/${studentId}/plans`,
    { params },
  );

  return data;
}

export type CreateStudentPlanTask = {
  title: string;
  subject: string;
  dueOn: string; // YYYY-MM-DD
};

export type CreateStudentPlanPayload = {
  name: string;
  startsOn: string;
  endsOn: string;
  coachId?: number;
  tasks: CreateStudentPlanTask[];
};

export type CreateStudentPlanResponse = {
  id: number;
};

export async function createStudentPlan(
  studentId: number,
  payload: CreateStudentPlanPayload,
): Promise<CreateStudentPlanResponse> {
  const { data } = await api.post<CreateStudentPlanResponse>(
    `/students/${studentId}/plans`,
    payload,
  );

  return data;
}
