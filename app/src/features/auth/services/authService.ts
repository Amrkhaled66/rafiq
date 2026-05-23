import { api } from "@/lib/api";

export type SigninPayload = { phone: string; password: string };

export type LoginResponse = {
  user: any;
  token: string;
};

export async function loginUser(
  payload: SigninPayload,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}
