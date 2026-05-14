import type { Database } from '../db/db.module';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { AuthorizationLookup } from './types/authorization.types';

export type AuthorizationDecision = 'allowed' | 'action_denied' | 'scope_denied';

export type NamedAuthorizationPolicyContext = {
  database: Database;
  request?: Record<string, unknown>;
  user: AuthenticatedUser;
  value?: number;
};

export type AuthorizationPolicyRequirement = {
  evaluate: (context: NamedAuthorizationPolicyContext) => Promise<boolean>;
  failure: Exclude<AuthorizationDecision, 'allowed'>;
  name: string;
};

export type NamedAuthorizationPolicy = {
  lookup?: AuthorizationLookup;
  name: string;
  requirements: AuthorizationPolicyRequirement[];
};
