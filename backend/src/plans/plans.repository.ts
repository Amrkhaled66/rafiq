import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { plans, tasks, users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { ListCoachPlansQueryDto } from './dto/list-coach-plans-query.dto';
import { ListStudentPlansQueryDto } from './dto/list-student-plans-query.dto';

export type StudentPlanListRow = {
  id: number;
  name: string;
  startsOn: string;
  endsOn: string;
  createdAt: Date;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
};

export type CoachPlanRow = {
  createdAt: Date;
  endsOn: string;
  id: number;
  missedTasksCount: number;
  startsOn: string;
  studentId: number;
  studentName: string;
  tasksCount: number;
};

export type PlanTaskDetailRow = {
  id: number;
  title: string;
  subject: string;
  status: string;
  dueAt: string;
  completedAt: Date | null;
};

@Injectable()
export class PlansRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async listStudentPlans(studentId: number, query: ListStudentPlansQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const items = await this.database
      .select({
        id: plans.id,
        name: plans.name,
        startsOn: plans.startsOn,
        endsOn: plans.endsOn,
        createdAt: plans.createdAt,
        totalTasks: sql<number>`count(${tasks.id})`,
        completedTasks: sql<number>`count(*) filter (where ${tasks.status} = 'done')`,
        missedTasks: sql<number>`count(*) filter (where ${tasks.status} = 'missed')`,
      })
      .from(plans)
      .leftJoin(tasks, eq(tasks.planId, plans.id))
      .where(eq(plans.studentId, studentId))
      .groupBy(plans.id)
      .orderBy(desc(plans.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await this.database
      .select({ total: sql<number>`count(*)` })
      .from(plans)
      .where(eq(plans.studentId, studentId));

    return {
      items: items as StudentPlanListRow[],
      page,
      limit,
      total: Number(total),
    };
  }

  async listCoachPlans(coachId: number, query: ListCoachPlansQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const items = await this.database
      .select({
        id: plans.id,
        studentId: plans.studentId,
        studentName: sql<string>`(
          select ${users.fullName}
          from ${users}
          where ${users.id} = ${plans.studentId}
        )`,
        startsOn: plans.startsOn,
        endsOn: plans.endsOn,
        createdAt: plans.createdAt,
        tasksCount: sql<number>`(
          select count(*)
          from ${tasks}
          where ${tasks.planId} = ${plans.id}
        )`,
        missedTasksCount: sql<number>`(
          select count(*)
          from ${tasks}
          where ${tasks.planId} = ${plans.id}
            and ${tasks.status} = 'missed'
        )`,
      })
      .from(plans)
      .where(eq(plans.coachId, coachId))
      .orderBy(desc(plans.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await this.database
      .select({ count: sql<number>`count(*)` })
      .from(plans)
      .where(eq(plans.coachId, coachId));

    return {
      items: items as CoachPlanRow[],
      limit,
      page,
      total: Number(count),
    };
  }

  async getStudentPlansStats(studentId: number) {
    const [stats] = await this.database
      .select({
        totalPlans: sql<number>`count(distinct ${plans.id})`,
        activePlans: sql<number>`count(distinct ${plans.id}) filter (
          where ${plans.startsOn} <= current_date
            and ${plans.endsOn} >= current_date
        )`,
        completedPlans: sql<number>`count(distinct ${plans.id}) filter (
          where ${plans.endsOn} < current_date
        )`,
        missedTasks: sql<number>`count(${tasks.id}) filter (
          where ${tasks.status} = 'missed'
        )`,
        upcomingTasks: sql<number>`count(${tasks.id}) filter (
          where ${tasks.dueAt} is not null
            and ${tasks.dueAt} >= current_date
            and ${tasks.dueAt} <= current_date + interval '7 days'
            and ${tasks.status} <> 'done'
        )`,
      })
      .from(plans)
      .leftJoin(tasks, eq(tasks.planId, plans.id))
      .where(eq(plans.studentId, studentId));

    return {
      totalPlans: Number(stats?.totalPlans ?? 0),
      activePlans: Number(stats?.activePlans ?? 0),
      completedPlans: Number(stats?.completedPlans ?? 0),
      missedTasks: Number(stats?.missedTasks ?? 0),
      upcomingTasks: Number(stats?.upcomingTasks ?? 0),
    };
  }

  async hasOverlappingPlan(input: {
    studentId: number;
    startsOn: string; // YYYY-MM-DD
    endsOn: string; // YYYY-MM-DD
    excludePlanId?: number;
  }): Promise<boolean> {
    // Overlap condition for inclusive ranges:
    // existing.startsOn <= new.endsOn AND existing.endsOn >= new.startsOn
    const record = await this.database.query.plans.findFirst({
      where: and(
        eq(plans.studentId, input.studentId),
        sql`${plans.startsOn} <= ${input.endsOn} and ${plans.endsOn} >= ${input.startsOn}`,
        input.excludePlanId
          ? sql`${plans.id} <> ${input.excludePlanId}`
          : undefined,
      ),
      columns: { id: true },
    });

    return Boolean(record);
  }

  async createStudentPlan(input: {
    studentId: number;
    coachId: number;
    name: string;
    startsOn: string;
    endsOn: string;
    tasks: Array<{ title: string; subject: string; dueOn: string }>;
  }) {
    return this.database.transaction(async (tx) => {
      const [createdPlan] = await tx
        .insert(plans)
        .values({
          name: input.name,
          studentId: input.studentId,
          coachId: input.coachId,
          startsOn: input.startsOn,
          endsOn: input.endsOn,
        })
        .returning({ id: plans.id });

      const taskRows = input.tasks.map((t) => ({
        planId: createdPlan.id,
        title: t.title,
        // subject is validated in service/DTO; keep as string for Drizzle enum column.
        subject: t.subject as any,
        dueAt: t.dueOn,
      }));

      if (taskRows.length > 0) {
        await tx.insert(tasks).values(taskRows);
      }

      return { id: createdPlan.id };
    });
  }

  async findPlanByIdAndStudent(planId: number, studentId: number) {
    return this.database.query.plans.findFirst({
      where: and(eq(plans.id, planId), eq(plans.studentId, studentId)),
    });
  }

  async listPlanTasks(planId: number): Promise<PlanTaskDetailRow[]> {
    const rows = await this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        subject: tasks.subject,
        status: tasks.status,
        dueAt: tasks.dueAt,
        completedAt: tasks.completedAt,
      })
      .from(tasks)
      .where(eq(tasks.planId, planId))
      .orderBy(tasks.dueAt, tasks.createdAt);

    return rows as PlanTaskDetailRow[];
  }

  async deletePlanById(planId: number, studentId: number): Promise<boolean> {
    const deleted = await this.database
      .delete(plans)
      .where(and(eq(plans.id, planId), eq(plans.studentId, studentId)))
      .returning({ id: plans.id });

    return deleted.length > 0;
  }

  async markTaskDone(taskId: number, planId: number) {
    const [updated] = await this.database
      .update(tasks)
      .set({
        status: 'done',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.planId, planId)))
      .returning({
        id: tasks.id,
        title: tasks.title,
        subject: tasks.subject,
        status: tasks.status,
        dueAt: tasks.dueAt,
        completedAt: tasks.completedAt,
      });

    return updated as PlanTaskDetailRow | undefined;
  }

  async updateStudentPlan(input: {
    planId: number;
    studentId: number;
    coachId: number;
    name: string;
    startsOn: string;
    endsOn: string;
    tasks: Array<{ title: string; subject: string; dueOn: string }>;
  }) {
    return this.database.transaction(async (tx) => {
      const [updatedPlan] = await tx
        .update(plans)
        .set({
          name: input.name,
          coachId: input.coachId,
          startsOn: input.startsOn,
          endsOn: input.endsOn,
          updatedAt: new Date(),
        })
        .where(and(eq(plans.id, input.planId), eq(plans.studentId, input.studentId)))
        .returning({ id: plans.id });

      await tx.delete(tasks).where(eq(tasks.planId, input.planId));

      const taskRows = input.tasks.map((t) => ({
        planId: input.planId,
        title: t.title,
        subject: t.subject as any,
        dueAt: t.dueOn,
      }));

      if (taskRows.length > 0) {
        await tx.insert(tasks).values(taskRows);
      }

      return { id: updatedPlan.id };
    });
  }
}
