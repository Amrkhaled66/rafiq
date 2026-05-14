import { NamedAuthorizationPolicy } from './authorization-policy.types';
import {
  requireAssignedStudentUserAccess,
  requireAnyRole,
  requireRole,
  requireStudentResourceAccess,
} from './authorization-policy-requirements';

export const namedAuthorizationPolicies: NamedAuthorizationPolicy[] = [
  {
    name: 'users.list',
    requirements: [requireAnyRole(['coach', 'super_admin'])],
  },
  {
    name: 'users.read',
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireAssignedStudentUserAccess('read'),
    ],
  },
  {
    name: 'users.create',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'users.update',
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireAssignedStudentUserAccess('update'),
    ],
  },
  {
    name: 'users.delete',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'students.list',
    requirements: [requireAnyRole(['coach', 'super_admin'])],
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
