import type { AddCoachFormValues } from "@/features/admin/coaches/schema/addCoachSchema";
import { api } from "@/lib/api";
import { USER_ROLES, type IUser } from "@/shared/interfaces/User";

export type Coach = IUser & {
  assignedStudentsCount: number;
};

export type CoachProfile = IUser;

export type CoachOverviewStats = {
  totalAssignedStudents: number;
  missedTasks: number;
  createdPlans: number;
};

export type CoachOverview = {
  coach: CoachProfile;
  stats: CoachOverviewStats;
};

export type CoachPlan = {
  id: number;
  studentId: number;
  studentName: string;
  startsOn: string;
  endsOn: string;
  createdAt: string;
  tasksCount: number;
  missedTasksCount: number;
};

export type CoachPlansResponse = {
  items: CoachPlan[];
  page: number;
  limit: number;
  total: number;
};

export type CoachesListResponse = {
  data: Coach[];
  page: number;
  limit: number;
  total: number;
};

export type ListCoachesParams = {
  page?: number;
  limit?: number;
  phone?: string;
};

export type ListCoachPlansParams = {
  page?: number;
  limit?: number;
};

export async function listCoaches(
  params: ListCoachesParams = {},
): Promise<CoachesListResponse> {
  const { data } = await api.get<CoachesListResponse>("/coaches", { params });

  return data;
}

export async function createCoach(payload: AddCoachFormValues): Promise<IUser> {
  const { data } = await api.post<IUser>("/users", {
    ...payload,
    role: USER_ROLES.COACH,
  });

  return data;
}

export async function getCoach(id: number): Promise<Coach> {
  const { data } = await api.get<Coach>(`/coaches/${id}`);
  return data;
}

export async function getCoachOverview(id: number): Promise<CoachOverview> {
  const { data } = await api.get<CoachOverview>(`/coaches/${id}/overview`);
  return data;
}

export async function listCoachPlans(
  id: number,
  params: ListCoachPlansParams = {},
): Promise<CoachPlansResponse> {
  const { data } = await api.get<CoachPlansResponse>(`/coaches/${id}/plans`, {
    params,
  });

  return data;
}
