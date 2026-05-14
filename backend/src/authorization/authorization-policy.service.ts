import { Inject, Injectable } from '@nestjs/common';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { namedAuthorizationPolicies } from './named-authorization-policies';
import {
  AuthorizationDecision,
  NamedAuthorizationPolicy,
} from './authorization-policy.types';
import { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class AuthorizationPolicyService {
  constructor(@Inject(db) private readonly database: Database) {}

  async authorizeNamedPolicy(
    user: AuthenticatedUser,
    policyName: string,
    request: Record<string, unknown>,
  ): Promise<AuthorizationDecision> {
    const policy = this.findNamedPolicy(policyName);

    if (!policy) {
      return 'action_denied';
    }

    const value = policy.lookup
      ? this.parseLookupValue(
          (request[policy.lookup.source] as Record<string, unknown> | undefined)?.[
            policy.lookup.key
          ],
        )
      : undefined;

    if (policy.lookup && value === null) {
      return 'scope_denied';
    }

    for (const requirement of policy.requirements) {
      const allowed = await requirement.evaluate({
        database: this.database,
        request,
        user,
        value: value ?? undefined,
      });

      if (!allowed) {
        return requirement.failure;
      }
    }

    return 'allowed';
  }

  private findNamedPolicy(policyName: string): NamedAuthorizationPolicy | undefined {
    return namedAuthorizationPolicies.find((policy) => policy.name === policyName);
  }

  private parseLookupValue(value: unknown): number | null {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }
}
