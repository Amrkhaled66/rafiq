import { Injectable } from '@nestjs/common';
import { AppRole } from './types/authenticated-user.type';
import {
  AuthorizationAction,
  AuthorizationResource,
} from './types/authorization.types';

type PermissionMatrix = Record<
  AppRole,
  Partial<Record<AuthorizationResource, AuthorizationAction[]>>
>;

const permissionMatrix: PermissionMatrix = {
  student: {
    student_profile: ['read'],
    subscription: ['read'],
    plan: ['read'],
    task: ['read'],
    task_session: ['read', 'create', 'update', 'delete'],
    lesson: ['read'],
  },
  coach: {
    user: ['read', 'update'],
    student_profile: ['read', 'update'],
    plan: ['read', 'create', 'update', 'delete'],
    task: ['read', 'create', 'update', 'delete'],
    task_session: ['read'],
    lesson: ['read', 'create', 'update', 'delete'],
  },
  super_admin: {
    user: ['manage'],
    student_profile: ['manage'],
    subscription: ['manage'],
    subscription_package: ['manage'],
    coach_assignment: ['manage'],
    plan: ['manage'],
    task: ['manage'],
    task_session: ['manage'],
    lesson: ['manage'],
  },
};

@Injectable()
export class AbilityFactory {
  can(
    role: AppRole,
    action: AuthorizationAction,
    resource: AuthorizationResource,
  ): boolean {
    const allowedActions = permissionMatrix[role][resource] ?? [];

    return allowedActions.includes('manage') || allowedActions.includes(action);
  }
}
