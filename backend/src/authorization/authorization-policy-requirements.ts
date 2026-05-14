import {
  canAccessStudentScope,
  canAccessUserScope,
  resolveResourceOwnerStudentId,
} from './authorization.policy-helpers';
import {
  AuthorizationPolicyRequirement,
  NamedAuthorizationPolicyContext,
} from './authorization-policy.types';
import { AppRole } from './types/authenticated-user.type';
import { AuthorizationResource } from './types/authorization.types';

type RequirementEvaluator = (
  context: NamedAuthorizationPolicyContext,
) => Promise<boolean>;

function namedRequirement(
  name: string,
  failure: AuthorizationPolicyRequirement['failure'],
  evaluate: RequirementEvaluator,
): AuthorizationPolicyRequirement {
  return {
    name,
    failure,
    evaluate,
  };
}

export function requireRole(role: AppRole): AuthorizationPolicyRequirement {
  return namedRequirement(`requireRole:${role}`, 'action_denied', async ({ user }) => {
    return user.role === role;
  });
}

export function requireAnyRole(
  roles: AppRole[],
): AuthorizationPolicyRequirement {
  return namedRequirement(
    `requireAnyRole:${roles.join('|')}`,
    'action_denied',
    async ({ user }) => roles.includes(user.role),
  );
}

export function requireAssignedStudentUserAccess(
  action: 'read' | 'update',
): AuthorizationPolicyRequirement {
  return namedRequirement(
    `requireAssignedStudentUserAccess:${action}`,
    'scope_denied',
    async ({ database, user, value }) => {
      if (user.role === 'super_admin') {
        return true;
      }

      return canAccessUserScope(database, user, action, value!);
    },
  );
}

export function requireStudentResourceAccess(
  resource: AuthorizationResource,
): AuthorizationPolicyRequirement {
  return namedRequirement(
    `requireStudentResourceAccess:${resource}`,
    'scope_denied',
    async ({ database, user, value }) => {
      if (user.role === 'super_admin') {
        return true;
      }

      const studentId = await resolveResourceOwnerStudentId(
        database,
        resource,
        value!,
      );

      return canAccessStudentScope(database, user, studentId);
    },
  );
}
