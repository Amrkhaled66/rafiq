export const AUTHORIZATION_ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
  'manage',
] as const;

export type AuthorizationAction = (typeof AUTHORIZATION_ACTIONS)[number];

export const AUTHORIZATION_RESOURCES = [
  'user',
  'student_profile',
  'subscription',
  'subscription_package',
  'coach_assignment',
  'plan',
  'task',
  'task_session',
  'lesson',
] as const;

export type AuthorizationResource =
  (typeof AUTHORIZATION_RESOURCES)[number];

export type RequestLookupSource = 'params' | 'body' | 'query';

export type AuthorizationLookupKind =
  | 'resourceId'
  | 'userId'
  | 'studentId'
  | 'coachId'
  | 'planId'
  | 'taskId';

export interface AuthorizationLookup {
  key: string;
  kind: AuthorizationLookupKind;
  source: RequestLookupSource;
}
