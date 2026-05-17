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
  {
    name: 'plans.list_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'plans.create_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'students.coaches.list',
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'students.coaches.assign',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'students.coaches.remove',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'lessons.watch_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['student', 'coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'plans.read_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'plans.update_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'plans.delete_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'plans.complete_task_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'lessons.list_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'lessons.create_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'lessons.update_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'lessons.delete_by_student',
    lookup: { key: 'studentId', kind: 'studentId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('student_profile'),
    ],
  },
  {
    name: 'missed_tasks.list',
    requirements: [requireAnyRole(['coach', 'super_admin'])],
  },
  {
    name: 'missed_tasks.resolve',
    lookup: { key: 'taskId', kind: 'taskId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('task'),
    ],
  },
  {
    name: 'missed_tasks.unresolve',
    lookup: { key: 'taskId', kind: 'taskId', source: 'params' },
    requirements: [
      requireAnyRole(['coach', 'super_admin']),
      requireStudentResourceAccess('task'),
    ],
  },
  {
    name: 'subscription_packages.list',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'subscription_packages.create',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'subscriptions.list',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'subscriptions.create',
    requirements: [requireRole('super_admin')],
  },
  {
    name: 'task_sessions.list',
    requirements: [requireAnyRole(['coach', 'super_admin'])],
  },
];
