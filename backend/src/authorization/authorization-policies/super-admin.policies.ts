import { AuthorizationPolicy } from '../authorization-policy.types';

export const superAdminPolicies: AuthorizationPolicy[] = [
  { role: 'super_admin', action: 'manage', resource: 'user' },
  { role: 'super_admin', action: 'manage', resource: 'student_profile' },
  { role: 'super_admin', action: 'manage', resource: 'subscription' },
  { role: 'super_admin', action: 'manage', resource: 'subscription_package' },
  { role: 'super_admin', action: 'manage', resource: 'coach_assignment' },
  { role: 'super_admin', action: 'manage', resource: 'plan' },
  { role: 'super_admin', action: 'manage', resource: 'task' },
  { role: 'super_admin', action: 'manage', resource: 'task_session' },
  { role: 'super_admin', action: 'manage', resource: 'lesson' },
];
