import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { AuthenticatedUser } from './types/authenticated-user.type';
import {
  AuthorizationAction,
  AuthorizationLookup,
  AuthorizationResource,
} from './types/authorization.types';
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
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

@Injectable()
export class AuthorizationScopeService {
  constructor(@Inject(db) private readonly database: Database) {}

  async isAllowed(
    user: AuthenticatedUser,
    resource: AuthorizationResource,
    action: AuthorizationAction,
    lookup?: AuthorizationLookup,
    rawValue?: unknown,
  ): Promise<boolean> {
    if (!lookup) {
      return false;
    }

    const value = this.parseLookupValue(rawValue);

    if (value === null) {
      return false;
    }

    switch (lookup.kind) {
      case 'resourceId':
        return this.checkByResourceId(user, resource, action, value);
      case 'studentId':
        return this.checkByStudentId(user, action, value);
      case 'userId':
        return this.checkByUserId(user, action, value);
      case 'coachId':
        return false;
      case 'planId':
        return this.checkByPlanId(user, action, value);
      case 'taskId':
        return this.checkByTaskId(user, action, value);
      default:
        return false;
    }
  }

  private parseLookupValue(value: unknown): number | null {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }

  private async checkByResourceId(
    user: AuthenticatedUser,
    resource: AuthorizationResource,
    action: AuthorizationAction,
    resourceId: number,
  ): Promise<boolean> {
    switch (resource) {
      case 'user':
        return this.checkUserScopedAccess(user, action, resourceId);
      case 'student_profile': {
        const record = await this.database.query.studentProfiles.findFirst({
          where: eq(studentProfiles.userId, resourceId),
        });

        return this.checkStudentScopedAccess(user, action, record?.userId);
      }
      case 'subscription': {
        const record = await this.database.query.subscriptions.findFirst({
          where: eq(subscriptions.id, resourceId),
        });

        return this.checkStudentScopedAccess(user, action, record?.studentId);
      }
      case 'subscription_package':
      case 'coach_assignment':
        return false;
      case 'plan': {
        const record = await this.database.query.plans.findFirst({
          where: eq(plans.id, resourceId),
        });

        return this.checkStudentScopedAccess(user, action, record?.studentId);
      }
      case 'task': {
        const record = await this.database
          .select({ studentId: plans.studentId })
          .from(tasks)
          .innerJoin(plans, eq(tasks.planId, plans.id))
          .where(eq(tasks.id, resourceId))
          .limit(1);

        return this.checkStudentScopedAccess(user, action, record[0]?.studentId);
      }
      case 'task_session': {
        const record = await this.database
          .select({ studentId: plans.studentId })
          .from(taskSessions)
          .innerJoin(tasks, eq(taskSessions.taskId, tasks.id))
          .innerJoin(plans, eq(tasks.planId, plans.id))
          .where(eq(taskSessions.id, resourceId))
          .limit(1);

        return this.checkStudentScopedAccess(user, action, record[0]?.studentId);
      }
      case 'lesson': {
        const record = await this.database.query.lessons.findFirst({
          where: eq(lessons.id, resourceId),
        });

        return this.checkStudentScopedAccess(user, action, record?.studentId);
      }
      default:
        return false;
    }
  }

  private async checkByStudentId(
    user: AuthenticatedUser,
    action: AuthorizationAction,
    studentId: number,
  ): Promise<boolean> {
    return this.checkStudentScopedAccess(user, action, studentId);
  }

  private async checkByUserId(
    user: AuthenticatedUser,
    action: AuthorizationAction,
    userId: number,
  ): Promise<boolean> {
    if (action !== 'read' && action !== 'update' && action !== 'delete') {
      return false;
    }

    return this.checkUserScopedAccess(user, action, userId);
  }

  private async checkByPlanId(
    user: AuthenticatedUser,
    action: AuthorizationAction,
    planId: number,
  ): Promise<boolean> {
    const record = await this.database.query.plans.findFirst({
      where: eq(plans.id, planId),
    });

    return this.checkStudentScopedAccess(user, action, record?.studentId);
  }

  private async checkByTaskId(
    user: AuthenticatedUser,
    action: AuthorizationAction,
    taskId: number,
  ): Promise<boolean> {
    const record = await this.database
      .select({ studentId: plans.studentId })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .where(eq(tasks.id, taskId))
      .limit(1);

    return this.checkStudentScopedAccess(user, action, record[0]?.studentId);
  }

  private async checkStudentScopedAccess(
    user: AuthenticatedUser,
    action: AuthorizationAction,
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

    if (action === 'delete' || action === 'update' || action === 'create') {
      return this.isCoachAssignedToStudent(user.sub, studentId);
    }

    return this.isCoachAssignedToStudent(user.sub, studentId);
  }

  private async checkUserScopedAccess(
    user: AuthenticatedUser,
    action: AuthorizationAction,
    userId: number,
  ): Promise<boolean> {
    const targetUser = await this.database.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!targetUser) {
      return false;
    }

    if (user.role === 'student') {
      return false;
    }

    if (user.role !== 'coach') {
      return false;
    }

    if (targetUser.deletedAt) {
      return false;
    }

    if (targetUser.role !== 'student') {
      return false;
    }

    if (action !== 'read' && action !== 'update') {
      return false;
    }

    return this.isCoachAssignedToStudent(user.sub, userId);
  }

  private async isCoachAssignedToStudent(
    coachId: number,
    studentId: number,
  ): Promise<boolean> {
    const assignment = await this.database.query.coachAssignments.findFirst({
      where: and(
        eq(coachAssignments.coachId, coachId),
        eq(coachAssignments.studentId, studentId),
      ),
    });

    return Boolean(assignment);
  }
}
