import { Inject, Injectable } from '@nestjs/common';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { authorizationPolicies } from './authorization-policies';
import {
  AuthorizationDecision,
  AuthorizationPolicy,
} from './authorization-policy.types';
import { AuthenticatedUser, AppRole } from './types/authenticated-user.type';
import {
  AuthorizationAction,
  AuthorizationLookup,
  AuthorizationRequirement,
  AuthorizationResource,
} from './types/authorization.types';

@Injectable()
export class AuthorizationPolicyService {
  constructor(@Inject(db) private readonly database: Database) {}

  async authorize(
    user: AuthenticatedUser,
    requirement: AuthorizationRequirement,
    rawValue?: unknown,
  ): Promise<AuthorizationDecision> {
    const actionPolicy = this.findPolicy(
      user.role,
      requirement.resource,
      requirement.action,
    );

    if (!actionPolicy) {
      return 'action_denied';
    }

    if (!requirement.lookup) {
      return actionPolicy.lookupKind ? 'scope_denied' : 'allowed';
    }

    if (actionPolicy.action === 'manage' && !actionPolicy.lookupKind) {
      return 'allowed';
    }

    const scopedPolicy = this.findPolicy(
      user.role,
      requirement.resource,
      requirement.action,
      requirement.lookup,
    );

    if (!scopedPolicy) {
      return 'scope_denied';
    }

    const value = this.parseLookupValue(rawValue);

    if (value === null) {
      return 'scope_denied';
    }

    if (!scopedPolicy.evaluate) {
      return 'allowed';
    }

    const allowed = await scopedPolicy.evaluate({
      database: this.database,
      user,
      value,
    });

    return allowed ? 'allowed' : 'scope_denied';
  }

  private findPolicy(
    role: AppRole,
    resource: AuthorizationResource,
    action: AuthorizationAction,
    lookup?: AuthorizationLookup,
  ): AuthorizationPolicy | undefined {
    return authorizationPolicies.find(
      (policy) =>
        policy.role === role &&
        policy.resource === resource &&
        (policy.action === 'manage' || policy.action === action) &&
        (lookup
          ? policy.lookupKind === lookup.kind
          : policy.lookupKind === undefined),
    );
  }

  private parseLookupValue(value: unknown): number | null {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }
}
