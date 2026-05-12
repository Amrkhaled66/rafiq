export const USER_ROLES = {
  STUDENT: "student",
  COACH: "coach",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

interface IUser {
  id: number;
  fullName: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export type { IUser };
