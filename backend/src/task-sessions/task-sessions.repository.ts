import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
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
  expectedEndAt: Date | null;
  durationSeconds: number;
  status: TaskSessionStatus;
};

export type TaskSessionStatus =
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type TaskSessionRow = {
  id: number;
  taskId: number;
  studentId: number;
  startedAt: Date;
  endedAt: Date | null;
  expectedEndAt: Date | null;
  accumulatedSeconds: number;
  lastStartedAt: Date | null;
  durationSeconds: number;
  status: TaskSessionStatus;
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
    status?: TaskSessionStatus;
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
        expectedEndAt: taskSessions.expectedEndAt,
        durationSeconds: this.durationSecondsSql(),
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
      items: items.map((item) => ({
        ...item,
        durationSeconds: Number(item.durationSeconds ?? 0),
      })) as TaskSessionListRow[],
      page: input.page,
      limit: input.limit,
      total: Number(total ?? 0),
    };
  }

  async getTaskSessionStats(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    studentPhone?: string;
    status?: TaskSessionStatus;
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
        pausedSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'paused')`,
        completedSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'completed')`,
        cancelledSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'cancelled')`,
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
      pausedSessions: Number(stats?.pausedSessions ?? 0),
      completedSessions: Number(stats?.completedSessions ?? 0),
      cancelledSessions: Number(stats?.cancelledSessions ?? 0),
    };
  }

  async listTaskSessionsByTask(input: {
    studentId: number;
    taskId: number;
    limit?: number;
  }): Promise<TaskSessionRow[]> {
    const rows = await this.database
      .select({
        id: taskSessions.id,
        taskId: taskSessions.taskId,
        studentId: taskSessions.studentId,
        startedAt: taskSessions.startedAt,
        endedAt: taskSessions.endedAt,
        expectedEndAt: taskSessions.expectedEndAt,
        accumulatedSeconds: taskSessions.accumulatedSeconds,
        lastStartedAt: taskSessions.lastStartedAt,
        durationSeconds: this.durationSecondsSql(),
        status: taskSessions.status,
      })
      .from(taskSessions)
      .where(
        and(
          eq(taskSessions.studentId, input.studentId),
          eq(taskSessions.taskId, input.taskId),
        ),
      )
      .orderBy(desc(taskSessions.startedAt), desc(taskSessions.id))
      .limit(input.limit ?? 20);

    return rows.map((row) => ({
      ...row,
      accumulatedSeconds: Number(row.accumulatedSeconds ?? 0),
      durationSeconds: Number(row.durationSeconds ?? 0),
    })) as TaskSessionRow[];
  }

  async getTaskSessionStatsByTask(input: { studentId: number; taskId: number }) {
    const [stats] = await this.database
      .select({
        totalSessions: count(taskSessions.id),
        completedSessions: sql<number>`count(${taskSessions.id}) filter (where ${taskSessions.status} = 'completed')`,
        totalFocusSeconds: sql<number>`coalesce(sum(${this.durationSecondsSql()}), 0)`,
      })
      .from(taskSessions)
      .where(
        and(
          eq(taskSessions.studentId, input.studentId),
          eq(taskSessions.taskId, input.taskId),
        ),
      );

    const totalFocusSeconds = Number(stats?.totalFocusSeconds ?? 0);

    return {
      totalFocusMinutes: Math.round(totalFocusSeconds / 60),
      totalSessions: Number(stats?.totalSessions ?? 0),
      completedSessions: Number(stats?.completedSessions ?? 0),
    };
  }

  async findActiveTaskSession(input: {
    studentId: number;
    taskId: number;
  }): Promise<TaskSessionRow | undefined> {
    const rows = await this.selectTaskSessionRows()
      .where(
        and(
          eq(taskSessions.studentId, input.studentId),
          eq(taskSessions.taskId, input.taskId),
          inArray(taskSessions.status, ['running', 'paused']),
        ),
      )
      .orderBy(desc(taskSessions.startedAt), desc(taskSessions.id))
      .limit(1);

    return this.toTaskSessionRow(rows[0]);
  }

  async findActiveTaskSessionByStudent(input: {
    studentId: number;
  }): Promise<TaskSessionRow | undefined> {
    const rows = await this.selectTaskSessionRows()
      .where(
        and(
          eq(taskSessions.studentId, input.studentId),
          inArray(taskSessions.status, ['running', 'paused']),
        ),
      )
      .orderBy(desc(taskSessions.startedAt), desc(taskSessions.id))
      .limit(1);

    return this.toTaskSessionRow(rows[0]);
  }

  async findTaskSessionById(
    sessionId: number,
  ): Promise<TaskSessionRow | undefined> {
    const rows = await this.selectTaskSessionRows()
      .where(eq(taskSessions.id, sessionId))
      .limit(1);

    return this.toTaskSessionRow(rows[0]);
  }

  async createTaskSession(input: {
    studentId: number;
    taskId: number;
    startedAt: Date;
    expectedEndAt: Date;
  }): Promise<TaskSessionRow> {
    const [created] = await this.database
      .insert(taskSessions)
      .values({
        studentId: input.studentId,
        taskId: input.taskId,
        startedAt: input.startedAt,
        expectedEndAt: input.expectedEndAt,
        lastStartedAt: input.startedAt,
        accumulatedSeconds: 0,
        status: 'running',
      })
      .returning();

    return {
      ...created,
      durationSeconds: 0,
    } as TaskSessionRow;
  }

  async updateTaskSession(input: {
    sessionId: number;
    status: TaskSessionStatus;
    accumulatedSeconds: number;
    lastStartedAt: Date | null;
    expectedEndAt: Date | null;
    endedAt?: Date | null;
    updatedAt: Date;
  }): Promise<TaskSessionRow | undefined> {
    const [updated] = await this.database
      .update(taskSessions)
      .set({
        status: input.status,
        accumulatedSeconds: input.accumulatedSeconds,
        lastStartedAt: input.lastStartedAt,
        expectedEndAt: input.expectedEndAt,
        endedAt: input.endedAt,
        updatedAt: input.updatedAt,
      })
      .where(eq(taskSessions.id, input.sessionId))
      .returning();

    if (!updated) {
      return undefined;
    }

    return {
      ...updated,
      durationSeconds: this.calculateDurationSeconds(updated, input.updatedAt),
    } as TaskSessionRow;
  }

  async completeExpiredRunningSessions(input: {
    now: Date;
  }): Promise<TaskSessionRow[]> {
    const updated = await this.database
      .update(taskSessions)
      .set({
        status: 'completed',
        accumulatedSeconds: sql<number>`(
          ${taskSessions.accumulatedSeconds}
          + greatest(
            0,
            extract(epoch from (
              ${taskSessions.expectedEndAt} - ${taskSessions.lastStartedAt}
            ))::int
          )
        )`,
        lastStartedAt: null,
        expectedEndAt: null,
        endedAt: taskSessions.expectedEndAt,
        updatedAt: input.now,
      })
      .where(
        and(
          eq(taskSessions.status, 'running'),
          lte(taskSessions.expectedEndAt, input.now),
        ),
      )
      .returning();

    return updated.map((session) => ({
      ...session,
      durationSeconds: this.calculateDurationSeconds(session, input.now),
    })) as TaskSessionRow[];
  }

  private buildWhereConditions(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    page: number;
    limit: number;
    studentPhone?: string;
    status?: TaskSessionStatus;
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

  private selectTaskSessionRows() {
    return this.database
      .select({
        id: taskSessions.id,
        taskId: taskSessions.taskId,
        studentId: taskSessions.studentId,
        startedAt: taskSessions.startedAt,
        endedAt: taskSessions.endedAt,
        expectedEndAt: taskSessions.expectedEndAt,
        accumulatedSeconds: taskSessions.accumulatedSeconds,
        lastStartedAt: taskSessions.lastStartedAt,
        durationSeconds: this.durationSecondsSql(),
        status: taskSessions.status,
      })
      .from(taskSessions);
  }

  private toTaskSessionRow(
    row:
      | {
          id: number;
          taskId: number;
          studentId: number;
          startedAt: Date;
          endedAt: Date | null;
          expectedEndAt: Date | null;
          accumulatedSeconds: number;
          lastStartedAt: Date | null;
          durationSeconds: number;
          status: TaskSessionStatus;
        }
      | undefined,
  ): TaskSessionRow | undefined {
    if (!row) {
      return undefined;
    }

    return {
      ...row,
      accumulatedSeconds: Number(row.accumulatedSeconds ?? 0),
      durationSeconds: Number(row.durationSeconds ?? 0),
    };
  }

  private durationSecondsSql() {
    return sql<number>`(
      ${taskSessions.accumulatedSeconds}
      + case
        when ${taskSessions.status} = 'running'
          and ${taskSessions.lastStartedAt} is not null
        then extract(epoch from (now() - ${taskSessions.lastStartedAt}))::int
        else 0
      end
    )`;
  }

  private calculateDurationSeconds(
    session: {
      accumulatedSeconds: number;
      lastStartedAt: Date | null;
      status: TaskSessionStatus;
    },
    now: Date,
  ) {
    const accumulatedSeconds = Number(session.accumulatedSeconds ?? 0);

    if (session.status !== 'running' || !session.lastStartedAt) {
      return accumulatedSeconds;
    }

    return (
      accumulatedSeconds +
      Math.max(
        0,
        Math.floor((now.getTime() - session.lastStartedAt.getTime()) / 1000),
      )
    );
  }
}
