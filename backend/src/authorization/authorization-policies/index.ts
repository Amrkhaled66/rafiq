import { AuthorizationPolicy } from '../authorization-policy.types';
import { coachDerivedResourcePolicies } from './coach-derived-resource.policies';
import { coachStudentResourcePolicies } from './coach-student-resource.policies';
import { coachUserPolicies } from './coach-user.policies';
import { studentPolicies } from './student.policies';
import { superAdminPolicies } from './super-admin.policies';

export const authorizationPolicies: AuthorizationPolicy[] = [
  ...studentPolicies,
  ...coachUserPolicies,
  ...coachStudentResourcePolicies,
  ...coachDerivedResourcePolicies,
  ...superAdminPolicies,
];
