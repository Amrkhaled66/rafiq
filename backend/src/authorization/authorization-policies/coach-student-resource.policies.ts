import { AuthorizationPolicy } from '../authorization-policy.types';
import {
  directStudentScopePolicy,
  studentOwnedResourcePolicies,
} from './builders';

export const coachStudentResourcePolicies: AuthorizationPolicy[] = [
  ...studentOwnedResourcePolicies('coach', 'student_profile', ['read', 'update']),
  ...studentOwnedResourcePolicies('coach', 'plan', ['read', 'update', 'delete']),
  directStudentScopePolicy('coach', 'create', 'plan', 'studentId'),
  ...studentOwnedResourcePolicies('coach', 'task', ['read', 'update', 'delete']),
  ...studentOwnedResourcePolicies('coach', 'task_session', ['read']),
  ...studentOwnedResourcePolicies('coach', 'lesson', ['read', 'update', 'delete']),
  directStudentScopePolicy('coach', 'create', 'lesson', 'studentId'),
];
