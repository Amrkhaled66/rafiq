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

export type CreateStudentPlanTask = {
  title: string;
  subject: string;
  dueOn: string;
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

export type StudentPlanDetailTask = {
  id: number;
  title: string;
  subject: string;
  status: string;
};

export type StudentPlanDetailDay = {
  date: string;
  weekday: string;
  progressPercent: number;
  tasks: StudentPlanDetailTask[];
};

export type StudentPlanDetailStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  progressPercent: number;
};

export type StudentPlanDetail = {
  plan: {
    id: number;
    name: string;
    startsOn: string;
    endsOn: string;
    createdAt: string;
    coachId?: number;
  };
  stats: StudentPlanDetailStats;
  days: StudentPlanDetailDay[];
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

export async function getStudentPlanDetail(
  studentId: number,
  planId: number,
): Promise<StudentPlanDetail> {
  const { data } = await api.get<StudentPlanDetail>(
    `/students/${studentId}/plans/${planId}`,
  );

  return data;
}

export async function updateStudentPlan(
  studentId: number,
  planId: number,
  payload: CreateStudentPlanPayload,
): Promise<CreateStudentPlanResponse> {
  const { data } = await api.patch<CreateStudentPlanResponse>(
    `/students/${studentId}/plans/${planId}`,
    payload,
  );

  return data;
}

export async function deleteStudentPlan(
  studentId: number,
  planId: number,
): Promise<{ ok: true }> {
  const { data } = await api.delete<{ ok: true }>(
    `/students/${studentId}/plans/${planId}`,
  );

  return data;
}

export async function completeStudentPlanTask(
  studentId: number,
  planId: number,
  taskId: number,
): Promise<StudentPlanDetailTask> {
  const { data } = await api.patch<StudentPlanDetailTask>(
    `/students/${studentId}/plans/${planId}/tasks/${taskId}/complete`,
  );

  return data;
}
