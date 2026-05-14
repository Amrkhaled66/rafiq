import { api } from "@/lib/api";
import { USER_ROLES, type IUser } from "@/shared/interfaces/User";
import type { AddCoachFormValues } from "@/features/admin/coaches/schema/addCoachSchema";

export type Coach = IUser & {
  assignedStudentsCount: number;
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

export async function listCoaches(
  params: ListCoachesParams = {},
): Promise<CoachesListResponse> {
  const { data } = await api.get<CoachesListResponse>("/users", {
    params: {
      ...params,
      role: USER_ROLES.COACH,
    },
  });

  return data;
}

export async function createCoach(payload: AddCoachFormValues): Promise<IUser> {
  const { data } = await api.post<IUser>("/users", {
    ...payload,
    role: USER_ROLES.COACH,
  });

  return data;
}

export async function getCoach(id: number): Promise<IUser> {
  const { data } = await api.get<IUser>(`/users/${id}`);
  return data;
}
