import { Inject, Injectable } from '@nestjs/common';
import { and, eq, inArray, lt, notExists } from 'drizzle-orm';
import { plans, tasks, taskSessions } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

export type TodayTaskRow = {
  id: number;
  title: string;
  subject: string;
  status: 'pending' | 'in_progress' | 'done' | 'missed';
  dueAt: string;
  planId: number;
};

export type StudentTaskDetailRow = {
  id: number;
  title: string;
  subject: string;
  status: 'pending' | 'in_progress' | 'done' | 'missed';
  dueAt: string;
  planId: number;
  completedAt: Date | null;
};

@Injectable()
export class TasksRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async listTodayTasksByStudent(
    studentId: number,
    today: string,
  ): Promise<TodayTaskRow[]> {
    const rows = await this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        subject: tasks.subject,
        status: tasks.status,
        dueAt: tasks.dueAt,
        planId: tasks.planId,
      })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .where(and(eq(plans.studentId, studentId), eq(tasks.dueAt, today)))
      .orderBy(tasks.status, tasks.id);

    return rows;
  }

  async findTaskByStudent(
    studentId: number,
    taskId: number,
  ): Promise<StudentTaskDetailRow | undefined> {
    const rows = await this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        subject: tasks.subject,
        status: tasks.status,
        dueAt: tasks.dueAt,
        planId: tasks.planId,
        completedAt: tasks.completedAt,
      })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .where(and(eq(plans.studentId, studentId), eq(tasks.id, taskId)))
      .limit(1);

    return rows[0];
  }

  async markTaskDone(taskId: number) {
    const completedAt = new Date();
    const [task] = await this.database
      .update(tasks)
      .set({
        status: 'done',
        completedAt,
        updatedAt: completedAt,
      })
      .where(eq(tasks.id, taskId))
      .returning({
        id: tasks.id,
        status: tasks.status,
        completedAt: tasks.completedAt,
      });

    return task;
  }

  async markOverdueTasksMissed(today: string) {
    return this.database
      .update(tasks)
      .set({
        status: 'missed',
        updatedAt: new Date(),
      })
      .where(
        and(
          inArray(tasks.status, ['pending', 'in_progress']),
          lt(tasks.dueAt, today),
          notExists(
            this.database
              .select({ id: taskSessions.id })
              .from(taskSessions)
              .where(
                and(
                  eq(taskSessions.taskId, tasks.id),
                  inArray(taskSessions.status, ['running', 'paused']),
                ),
              ),
          ),
        ),
      )
      .returning({ id: tasks.id });
  }
}
