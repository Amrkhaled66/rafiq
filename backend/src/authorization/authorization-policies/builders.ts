import {
  canAccessStudentScope,
  canAccessUserScope,
  resolvePlanStudentId,
  resolveResourceOwnerStudentId,
} from '../authorization.policy-helpers';
import { AuthorizationPolicy } from '../authorization-policy.types';
import { AppRole } from '../types/authenticated-user.type';
import {
  AuthorizationAction,
  AuthorizationResource,
} from '../types/authorization.types';

export function studentOwnedResourcePolicy(
  role: AppRole,
  action: AuthorizationAction,
  resource: AuthorizationResource,
): AuthorizationPolicy {
  return {
    role,
    action,
    resource,
    lookupKind: 'resourceId',
    evaluate: async ({ database, user, value }) =>
      canAccessStudentScope(
        database,
        user,
        await resolveResourceOwnerStudentId(database, resource, value!),
      ),
  };
}

export function studentOwnedResourcePolicies(
  role: AppRole,
  resource: AuthorizationResource,
  actions: AuthorizationAction[],
): AuthorizationPolicy[] {
  return actions.map((action) => studentOwnedResourcePolicy(role, action, resource));
}

export function directStudentScopePolicy(
  role: AppRole,
  action: AuthorizationAction,
  resource: AuthorizationResource,
  lookupKind: 'studentId' | 'resourceId',
): AuthorizationPolicy {
  return {
    role,
    action,
    resource,
    lookupKind,
    evaluate: async ({ database, user, value }) =>
      canAccessStudentScope(database, user, value),
  };
}

export function planStudentScopePolicy(
  role: AppRole,
  action: AuthorizationAction,
  resource: AuthorizationResource,
): AuthorizationPolicy {
  return {
    role,
    action,
    resource,
    lookupKind: 'planId',
    evaluate: async ({ database, user, value }) =>
      canAccessStudentScope(
        database,
        user,
        await resolvePlanStudentId(database, value!),
      ),
  };
}

export function userScopePolicy(
  role: AppRole,
  action: 'read' | 'update',
  resource: 'user',
): AuthorizationPolicy {
  return {
    role,
    action,
    resource,
    lookupKind: 'resourceId',
    evaluate: ({ database, user, value }) =>
      canAccessUserScope(database, user, action, value!),
  };
}
