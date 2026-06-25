import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  sql,
  type SQL,
} from 'drizzle-orm';
import { coachAssignments, plans, taskSessions, tasks, users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

export type TaskSessionListRow = {
  id: number;
  studentId: number;
  studentName: string;
  taskId: number;
  taskName: string;
  planId: number;
  planName: string;
  startedAt: Date;
  endedAt: Date | null;
  status: 'running' | 'completed' | 'stopped';
};

@Injectable()
export class TaskSessionsRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async listTaskSessions(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    page: number;
    limit: number;
    studentPhone?: string;
    status?: 'running' | 'completed' | 'stopped';
    from?: string;
    to?: string;
  }) {
    const offset = (input.page - 1) * input.limit;
    const conditions = this.buildWhereConditions(input);

    let itemsQuery = this.database
      .select({
        id: taskSessions.id,
        studentId: taskSessions.studentId,
        studentName: users.fullName,
        taskId: tasks.id,
        taskName: tasks.title,
        planId: tasks.planId,
        planName: plans.name,
        startedAt: taskSessions.startedAt,
        endedAt: taskSessions.endedAt,
        status: taskSessions.status,
      })
      .from(taskSessions)
      .innerJoin(users, eq(taskSessions.studentId, users.id))
      .innerJoin(tasks, eq(taskSessions.taskId, tasks.id))
      .leftJoin(plans, eq(tasks.planId, plans.id))
      .where(and(...conditions))
      .orderBy(desc(taskSessions.startedAt), desc(taskSessions.id))
      .limit(input.limit)
      .offset(offset);

    if (input.role === 'coach') {
      itemsQuery = itemsQuery.leftJoin(
        coachAssignments,
        and(
          eq(coachAssignments.studentId, taskSessions.studentId),
          eq(coachAssignments.coachId, input.userId),
        ),
      );
    }

    const items = await itemsQuery;

    let totalQuery = this.database
      .select({ total: count(taskSessions.id) })
      .from(taskSessions)
      .innerJoin(users, eq(taskSessions.studentId, users.id))
      .where(and(...conditions));

    if (input.role === 'coach') {
      totalQuery = totalQuery.leftJoin(
        coachAssignments,
        and(
          eq(coachAssignments.studentId, taskSessions.studentId),
          eq(coachAssignments.coachId, input.userId),
        ),
      );
    }

    const [{ total }] = await totalQuery;

    return {
      items: items as TaskSessionListRow[],
      page: input.page,
      limit: input.limit,
      total: Number(total ?? 0),
    };
  }

  async getTaskSessionStats(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    studentPhone?: string;
    status?: 'running' | 'completed' | 'stopped';
    from?: string;
    to?: string;
  }) {
    const conditions = this.buildWhereConditions({
      ...input,
      page: 1,
      limit: 1,
    });

    let statsQuery = this.database
      .select({
        totalSessions: count(taskSessions.id),
        runningSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'running')`,
        completedSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'completed')`,
        stoppedSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'stopped')`,
      })
      .from(taskSessions)
      .innerJoin(users, eq(taskSessions.studentId, users.id))
      .where(and(...conditions));

    if (input.role === 'coach') {
      statsQuery = statsQuery.leftJoin(
        coachAssignments,
        and(
          eq(coachAssignments.studentId, taskSessions.studentId),
          eq(coachAssignments.coachId, input.userId),
        ),
      );
    }

    const [stats] = await statsQuery;

    return {
      totalSessions: Number(stats?.totalSessions ?? 0),
      runningSessions: Number(stats?.runningSessions ?? 0),
      completedSessions: Number(stats?.completedSessions ?? 0),
      stoppedSessions: Number(stats?.stoppedSessions ?? 0),
    };
  }

  private buildWhereConditions(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    page: number;
    limit: number;
    studentPhone?: string;
    status?: 'running' | 'completed' | 'stopped';
    from?: string;
    to?: string;
  }): SQL[] {
    const conditions: SQL[] = [];

    if (input.role === 'coach') {
      conditions.push(eq(coachAssignments.coachId, input.userId));
    }

    if (input.studentPhone?.trim()) {
      conditions.push(ilike(users.phone, `%${input.studentPhone.trim()}%`));
    }

    if (input.status) {
      conditions.push(eq(taskSessions.status, input.status));
    }

    if (input.from) {
      conditions.push(gte(sql`date(${taskSessions.startedAt})`, input.from));
    }

    if (input.to) {
      conditions.push(lte(sql`date(${taskSessions.startedAt})`, input.to));
    }

    return conditions;
  }
}
