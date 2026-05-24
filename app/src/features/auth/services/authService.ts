import { api } from "@/lib/api";
import type { AuthUser, LoginFormValues } from "@/features/auth/types";

export type SigninPayload = LoginFormValues;

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export async function loginUser(
  payload: SigninPayload,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}
