import { AuthorizationPolicy } from '../authorization-policy.types';
import { userScopePolicy } from './builders';

export const coachUserPolicies: AuthorizationPolicy[] = [
  { role: 'coach', action: 'read', resource: 'user' },
  userScopePolicy('coach', 'read', 'user'),
  userScopePolicy('coach', 'update', 'user'),
];
