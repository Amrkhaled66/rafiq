import type { IUser } from "@/shared/interfaces/User";
import { USER_ROLES } from "@/shared/interfaces/User";

export type Resource =
  | "admin_dashboard"
  | "coaches"
  | "student_coach_assignments"
  | "plans_admin"
  | "subscriptions"
  | "subscription_packages";

export type Action = "read" | "create" | "update" | "delete";

type PermissionMatrix = Record<
  Exclude<IUser["role"], "student"> | "student",
  Partial<Record<Resource, readonly Action[]>>
>;

const ROLE_PERMISSIONS: PermissionMatrix = {
  [USER_ROLES.SUPER_ADMIN]: {
    admin_dashboard: ["read"],
    coaches: ["read"],
    student_coach_assignments: ["update"],
    plans_admin: ["read", "create", "update", "delete"],
    subscriptions: ["read", "create"],
    subscription_packages: ["read", "create"],
  },
  [USER_ROLES.COACH]: {
    admin_dashboard: ["read"],
  },
  [USER_ROLES.STUDENT]: {},
};

export function can(
  user: IUser | null | undefined,
  resource: Resource,
  action: Action,
) {
  if (!user) return false;
  const allowed = ROLE_PERMISSIONS[user.role]?.[resource] ?? [];
  return (allowed as readonly Action[]).includes(action);
}
