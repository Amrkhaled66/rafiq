import { NamedAuthorizationPolicy } from './authorization-policy.types';
import {
  requireAnyRole,
  requireRole,
  requireStudentResourceAccess,
} from './authorization-policy-requirements';

export const namedAuthorizationPolicies: NamedAuthorizationPolicy[] = [
  {
    name: 'users.create',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'students.list',
    requirements: [requireAnyRole(['coach', 'super_admin'])],
  },
  {
    name: 'coaches.list',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'coaches.read',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'coaches.update',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'students.read',
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
    requirements: [
      requireAnyRole(['student', 'coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'students.create',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'students.update',
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
];
