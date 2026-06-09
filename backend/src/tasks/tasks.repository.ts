import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { plans, tasks } from '../db';
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

    return rows as TodayTaskRow[];
  }
}
