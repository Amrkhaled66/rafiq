import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  sql,
  type SQL,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { coachAssignments, plans, tasks, users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { ListCoachPlansQueryDto } from './dto/list-coach-plans-query.dto';
import { ListCoachesQueryDto } from './dto/list-coaches-query.dto';

export type CoachRow = typeof users.$inferSelect & {
  assignedStudentsCount: number;
};

export type CoachOverviewRow = typeof users.$inferSelect & {
  createdPlans: number;
  missedTasks: number;
  totalAssignedStudents: number;
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

@Injectable()
export class CoachesRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async list(query: ListCoachesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const whereClause = this.buildWhereClause(query);

    const items = await this.database
      .select({
        id: users.id,
        fullName: users.fullName,
        phone: users.phone,
        password: users.password,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
        assignedStudentsCount: sql<number>`count(${coachAssignments.studentId})`,
      })
      .from(users)
      .leftJoin(coachAssignments, eq(users.id, coachAssignments.coachId))
      .where(whereClause)
      .groupBy(users.id)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await this.database
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    return {
      items: items as CoachRow[],
      page,
      limit,
      total: Number(count),
    };
  }

  async findById(id: number): Promise<CoachRow | undefined> {
    const [coach] = await this.database
      .select({
        id: users.id,
        fullName: users.fullName,
        phone: users.phone,
        password: users.password,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
        assignedStudentsCount: sql<number>`count(${coachAssignments.studentId})`,
      })
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, 'coach')));
    return coach as CoachRow | undefined;
  }

  async findOverviewById(id: number): Promise<CoachOverviewRow | undefined> {
    const coachUser = alias(users, 'coach_user');

    const [coach] = await this.database
      .select({
        id: coachUser.id,
        fullName: coachUser.fullName,
        phone: coachUser.phone,
        password: coachUser.password,
        role: coachUser.role,
        createdAt: coachUser.createdAt,
        totalAssignedStudents: sql<number>`(
          select count(*)
          from ${coachAssignments}
          where ${coachAssignments.coachId} = ${coachUser.id}
        )`,
        createdPlans: sql<number>`(
          select count(*)
          from ${plans}
          where ${plans.coachId} = ${coachUser.id}
        )`,
      })
      .from(coachUser)
      .where(and(eq(coachUser.id, id), eq(coachUser.role, 'coach')));

    return coach as CoachOverviewRow | undefined;
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

  private buildWhereClause(query: ListCoachesQueryDto): SQL {
    const conditions: SQL[] = [eq(users.role, 'coach')];

    if (query.phone?.trim()) {
      conditions.push(ilike(users.phone, `%${query.phone.trim()}%`));
    }

    if (query.deletedStatus === 'active') {
      conditions.push(isNull(users.deletedAt));
    } else if (query.deletedStatus === 'deleted') {
      conditions.push(isNotNull(users.deletedAt));
    }

    return and(...conditions) as SQL;
  }
}
