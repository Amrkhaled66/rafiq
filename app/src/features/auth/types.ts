export type AuthUserRole = "admin" | "coach" | "student";

export type AuthUser = {
  id: number;
  fullName: string;
  phone: string;
  role: AuthUserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type LoginFormValues = {
  phone: string;
  password: string;
};
