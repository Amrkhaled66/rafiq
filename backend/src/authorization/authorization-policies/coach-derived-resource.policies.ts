import { AuthorizationPolicy } from '../authorization-policy.types';
import { planStudentScopePolicy } from './builders';

export const coachDerivedResourcePolicies: AuthorizationPolicy[] = [
  planStudentScopePolicy('coach', 'create', 'task'),
];
