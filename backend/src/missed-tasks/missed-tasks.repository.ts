import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm';
import {
  coachAssignments,
  missedTaskResolutions,
  plans,
  tasks,
  users,
} from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

export type MissedTaskListRow = {
  taskId: number;
  taskName: string;
  subject: string;
  studentId: number;
  studentName: string;
  planId: number;
  planName: string;
  coachId: number;
  coachName: string;
  dueAt: string;
  status: string;
  isResolved: boolean;
  resolvedAt: Date | null;
  resolvedByName: string | null;
  resolutionNote: string | null;
};

@Injectable()
export class MissedTasksRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async listMissedTasks(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    page: number;
    limit: number;
    from?: string;
    to?: string;
    status?: 'resolved' | 'unresolved';
    coachId?: number;
  }) {
    const offset = (input.page - 1) * input.limit;
    const coachScope =
      input.role === 'coach'
        ? eq(coachAssignments.coachId, input.userId)
        : input.coachId
          ? eq(plans.coachId, input.coachId)
          : undefined;
    const fromFilter = input.from ? gte(tasks.dueAt, input.from) : undefined;
    const toFilter = input.to ? lte(tasks.dueAt, input.to) : undefined;
    const resolutionFilter =
      input.status === 'resolved'
        ? sql`${missedTaskResolutions.id} is not null`
        : input.status === 'unresolved'
          ? sql`${missedTaskResolutions.id} is null`
          : undefined;

    const items = await this.database
      .select({
        taskId: tasks.id,
        taskName: tasks.title,
        subject: tasks.subject,
        studentId: plans.studentId,
        studentName: sql<string>`${users.fullName}`,
        planId: plans.id,
        planName: plans.name,
        coachId: plans.coachId,
        coachName: sql<string>`coach_users.full_name`,
        dueAt: tasks.dueAt,
        status: tasks.status,
        isResolved: sql<boolean>`${missedTaskResolutions.id} is not null`,
        resolvedAt: missedTaskResolutions.resolvedAt,
        resolvedByName: sql<string | null>`resolver_users.full_name`,
        resolutionNote: missedTaskResolutions.note,
      })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .innerJoin(users, eq(plans.studentId, users.id))
      .innerJoin(
        sql`users as coach_users`,
        sql`coach_users.id = ${plans.coachId}`,
      )
      .leftJoin(
        missedTaskResolutions,
        eq(missedTaskResolutions.taskId, tasks.id),
      )
      .leftJoin(
        sql`users as resolver_users`,
        sql`resolver_users.id = ${missedTaskResolutions.resolvedBy}`,
      )
      .leftJoin(
        coachAssignments,
        and(
          eq(coachAssignments.studentId, plans.studentId),
          input.role === 'coach'
            ? eq(coachAssignments.coachId, input.userId)
            : undefined,
        ),
      )
      .where(
        and(
          eq(tasks.status, 'missed'),
          coachScope,
          fromFilter,
          toFilter,
          resolutionFilter,
        ),
      )
      .orderBy(desc(tasks.dueAt), desc(tasks.id))
      .limit(input.limit)
      .offset(offset);

    const [{ total }] = await this.database
      .select({ total: count() })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .leftJoin(
        missedTaskResolutions,
        eq(missedTaskResolutions.taskId, tasks.id),
      )
      .leftJoin(
        coachAssignments,
        and(
          eq(coachAssignments.studentId, plans.studentId),
          input.role === 'coach'
            ? eq(coachAssignments.coachId, input.userId)
            : undefined,
        ),
      )
      .where(
        and(
          eq(tasks.status, 'missed'),
          coachScope,
          fromFilter,
          toFilter,
          resolutionFilter,
        ),
      );

    return {
      items: items as MissedTaskListRow[],
      page: input.page,
      limit: input.limit,
      total: Number(total ?? 0),
    };
  }

  async getMissedTasksStats(input: {
    role: 'coach' | 'super_admin';
    userId: number;
  }) {
    const roleScope =
      input.role === 'coach'
        ? eq(coachAssignments.coachId, input.userId)
        : undefined;

    const [stats] = await this.database
      .select({
        totalMissed: count(tasks.id),
        totalResolved:
          sql<number>`count(${tasks.id}) filter (where ${missedTaskResolutions.id} is not null)`,
        totalUnresolved:
          sql<number>`count(${tasks.id}) filter (where ${missedTaskResolutions.id} is null)`,
      })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .leftJoin(
        missedTaskResolutions,
        eq(missedTaskResolutions.taskId, tasks.id),
      )
      .leftJoin(
        coachAssignments,
        and(
          eq(coachAssignments.studentId, plans.studentId),
          roleScope,
        ),
      )
      .where(
        and(
          eq(tasks.status, 'missed'),
          roleScope ? eq(coachAssignments.coachId, input.userId) : undefined,
        ),
      );

    return {
      totalMissed: Number(stats?.totalMissed ?? 0),
      totalResolved: Number(stats?.totalResolved ?? 0),
      totalUnresolved: Number(stats?.totalUnresolved ?? 0),
    };
  }

  async resolveTask(taskId: number, resolvedBy: number, note: string) {
    const inserted = await this.database
      .insert(missedTaskResolutions)
      .values({
        taskId,
        resolvedBy,
        note,
      })
      .onConflictDoUpdate({
        target: missedTaskResolutions.taskId,
        set: {
          resolvedBy,
          note,
          resolvedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning({ id: missedTaskResolutions.id });

    return inserted[0];
  }

  async unresolveTask(taskId: number) {
    const deleted = await this.database
      .delete(missedTaskResolutions)
      .where(eq(missedTaskResolutions.taskId, taskId))
      .returning({ id: missedTaskResolutions.id });

    return deleted.length > 0;
  }
}
