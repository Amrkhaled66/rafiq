import { api } from "@/lib/api";
import type { IUser } from "@/shared/interfaces/User";
import type { SigninFormValues } from "@/features/admin/auth/schema/signinSchema";

export type LoginResponse = {
  user: IUser;
  token: string;
};

export async function loginAdmin(
  payload: SigninFormValues,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}
