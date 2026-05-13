import type { Database } from '../db/db.module';
import { AuthenticatedUser, AppRole } from './types/authenticated-user.type';
import {
  AuthorizationAction,
  AuthorizationLookup,
  AuthorizationResource,
} from './types/authorization.types';

export type AuthorizationDecision = 'allowed' | 'action_denied' | 'scope_denied';

export type AuthorizationPolicyContext = {
  database: Database;
  user: AuthenticatedUser;
  value?: number;
};

export type AuthorizationPolicy = {
  action: AuthorizationAction | 'manage';
  evaluate?: (context: AuthorizationPolicyContext) => Promise<boolean>;
  lookupKind?: AuthorizationLookup['kind'];
  resource: AuthorizationResource;
  role: AppRole;
};
