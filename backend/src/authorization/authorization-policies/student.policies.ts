import { AuthorizationPolicy } from '../authorization-policy.types';
import { studentOwnedResourcePolicies } from './builders';

export const studentPolicies: AuthorizationPolicy[] = [
  ...studentOwnedResourcePolicies('student', 'student_profile', ['read']),
  ...studentOwnedResourcePolicies('student', 'subscription', ['read']),
  ...studentOwnedResourcePolicies('student', 'plan', ['read']),
  ...studentOwnedResourcePolicies('student', 'task', ['read']),
  ...studentOwnedResourcePolicies('student', 'task_session', [
    'read',
    'create',
    'update',
    'delete',
  ]),
  ...studentOwnedResourcePolicies('student', 'lesson', ['read']),
];
