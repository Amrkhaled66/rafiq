import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, isNull, sql } from 'drizzle-orm';
import { coachAssignments, plans, tasks, users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import type {
  DailyTaskProgressSort,
  DailyTaskProgressSortOrder,
  DailyTaskProgressStatus,
} from './dto/list-daily-task-progress-query.dto';

export type DailyTaskProgressRow = {
  studentId: number;
  studentName: string;
  studentPhone: string;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  completionPercent: number;
};

@Injectable()
export class DailyTaskProgressRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async list(input: {
    role: 'coach' | 'super_admin';
    userId: number;
    date: string;
    status: DailyTaskProgressStatus;
    page: number;
    limit: number;
    sortBy: DailyTaskProgressSort;
    sortOrder: DailyTaskProgressSortOrder;
  }) {
    const dailyProgress = this.database
      .select({
        studentId: plans.studentId,
        studentName: users.fullName,
        studentPhone: users.phone,
        totalTasks: count(tasks.id).mapWith(Number).as('total_tasks'),
        completedTasks:
          sql<number>`count(${tasks.id}) filter (where ${tasks.status} = 'done')`
            .mapWith(Number)
            .as('completed_tasks'),
        missedTasks:
          sql<number>`count(${tasks.id}) filter (where ${tasks.status} = 'missed')`
            .mapWith(Number)
            .as('missed_tasks'),
      })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .innerJoin(users, eq(plans.studentId, users.id))
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
          eq(tasks.dueAt, input.date),
          eq(users.role, 'student'),
          isNull(users.deletedAt),
          input.role === 'coach'
            ? eq(coachAssignments.coachId, input.userId)
            : undefined,
        ),
      )
      .groupBy(plans.studentId, users.fullName, users.phone)
      .as('daily_progress');

    const finishedCondition = sql`${dailyProgress.completedTasks} = ${dailyProgress.totalTasks}`;
    const statusCondition =
      input.status === 'finished'
        ? finishedCondition
        : sql`${dailyProgress.completedTasks} < ${dailyProgress.totalTasks}`;
    const sortColumn = {
      studentName: dailyProgress.studentName,
      totalTasks: dailyProgress.totalTasks,
      completedTasks: dailyProgress.completedTasks,
      missedTasks: dailyProgress.missedTasks,
    }[input.sortBy];
    const sortExpression =
      input.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);
    const offset = (input.page - 1) * input.limit;

    const [summaryRows, totalRows, items] = await Promise.all([
      this.database
        .select({
          finishedStudents:
            sql<number>`count(*) filter (where ${finishedCondition})`.mapWith(
              Number,
            ),
          unfinishedStudents:
            sql<number>`count(*) filter (where not (${finishedCondition}))`.mapWith(
              Number,
            ),
        })
        .from(dailyProgress),
      this.database
        .select({ total: count().mapWith(Number) })
        .from(dailyProgress)
        .where(statusCondition),
      this.database
        .select({
          studentId: dailyProgress.studentId,
          studentName: dailyProgress.studentName,
          studentPhone: dailyProgress.studentPhone,
          totalTasks: dailyProgress.totalTasks,
          completedTasks: dailyProgress.completedTasks,
          missedTasks: dailyProgress.missedTasks,
          completionPercent:
            sql<number>`round((${dailyProgress.completedTasks}::numeric / ${dailyProgress.totalTasks}) * 100)`.mapWith(
              Number,
            ),
        })
        .from(dailyProgress)
        .where(statusCondition)
        .orderBy(
          sortExpression,
          asc(dailyProgress.studentName),
          asc(dailyProgress.studentId),
        )
        .limit(input.limit)
        .offset(offset),
    ]);

    return {
      summary: {
        finishedStudents: Number(summaryRows[0]?.finishedStudents ?? 0),
        unfinishedStudents: Number(summaryRows[0]?.unfinishedStudents ?? 0),
      },
      items: items as DailyTaskProgressRow[],
      page: input.page,
      limit: input.limit,
      total: Number(totalRows[0]?.total ?? 0),
    };
  }
}
