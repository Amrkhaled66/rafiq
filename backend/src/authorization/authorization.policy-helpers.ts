import { and, eq } from 'drizzle-orm';
import {
  coachAssignments,
  lessons,
  plans,
  studentProfiles,
  subscriptions,
  taskSessions,
  tasks,
  users,
} from '../db';
import type { Database } from '../db/db.module';
import { AuthenticatedUser } from './types/authenticated-user.type';
import {
  AuthorizationAction,
  AuthorizationResource,
} from './types/authorization.types';

export async function resolveResourceOwnerStudentId(
  database: Database,
  resource: AuthorizationResource,
  resourceId: number,
): Promise<number | undefined> {
  switch (resource) {
    case 'student_profile': {
      const record = await database.query.studentProfiles.findFirst({
        where: eq(studentProfiles.userId, resourceId),
      });

      return record?.userId;
    }
    case 'subscription': {
      const record = await database.query.subscriptions.findFirst({
        where: eq(subscriptions.id, resourceId),
      });

      return record?.studentId;
    }
    case 'plan': {
      const record = await database.query.plans.findFirst({
        where: eq(plans.id, resourceId),
      });

      return record?.studentId;
    }
    case 'task': {
      const record = await database
        .select({ studentId: plans.studentId })
        .from(tasks)
        .innerJoin(plans, eq(tasks.planId, plans.id))
        .where(eq(tasks.id, resourceId))
        .limit(1);

      return record[0]?.studentId;
    }
    case 'task_session': {
      const record = await database
        .select({ studentId: plans.studentId })
        .from(taskSessions)
        .innerJoin(tasks, eq(taskSessions.taskId, tasks.id))
        .innerJoin(plans, eq(tasks.planId, plans.id))
        .where(eq(taskSessions.id, resourceId))
        .limit(1);

      return record[0]?.studentId;
    }
    case 'lesson': {
      const record = await database.query.lessons.findFirst({
        where: eq(lessons.id, resourceId),
      });

      return record?.studentId;
    }
    default:
      return undefined;
  }
}

export async function resolvePlanStudentId(
  database: Database,
  planId: number,
): Promise<number | undefined> {
  const record = await database.query.plans.findFirst({
    where: eq(plans.id, planId),
  });

  return record?.studentId;
}

export async function resolveTaskStudentId(
  database: Database,
  taskId: number,
): Promise<number | undefined> {
  const record = await database
    .select({ studentId: plans.studentId })
    .from(tasks)
    .innerJoin(plans, eq(tasks.planId, plans.id))
    .where(eq(tasks.id, taskId))
    .limit(1);

  return record[0]?.studentId;
}

export async function canAccessStudentScope(
  database: Database,
  user: AuthenticatedUser,
  studentId?: number,
): Promise<boolean> {
  if (!studentId) {
    return false;
  }

  if (user.role === 'student') {
    return user.sub === studentId;
  }

  if (user.role !== 'coach') {
    return false;
  }

  const assignment = await database.query.coachAssignments.findFirst({
    where: and(
      eq(coachAssignments.coachId, user.sub),
      eq(coachAssignments.studentId, studentId),
    ),
  });

  return Boolean(assignment);
}

export async function canAccessUserScope(
  database: Database,
  user: AuthenticatedUser,
  action: AuthorizationAction,
  userId: number,
): Promise<boolean> {
  const targetUser = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!targetUser) {
    return false;
  }

  if (user.role !== 'coach') {
    return false;
  }

  if (targetUser.deletedAt || targetUser.role !== 'student') {
    return false;
  }

  if (action !== 'read' && action !== 'update') {
    return false;
  }

  const assignment = await database.query.coachAssignments.findFirst({
    where: and(
      eq(coachAssignments.coachId, user.sub),
      eq(coachAssignments.studentId, userId),
    ),
  });

  return Boolean(assignment);
}
