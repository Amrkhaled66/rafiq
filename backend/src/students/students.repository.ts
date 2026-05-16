import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  type SQL,
  sql,
} from 'drizzle-orm';
import {
  coachAssignments,
  plans,
  studentProfiles,
  taskSessions,
  tasks,
  users,
} from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import type { AppRole } from '../authorization/types/authenticated-user.type';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';

type StudentProfileRow = typeof studentProfiles.$inferSelect;

export interface StudentAggregate {
  id: number;
  fullName: string;
  phone: string;
  role: AppRole;
  city: StudentProfileRow['city'];
  parentPhone: string;
  gradeLevel: StudentProfileRow['gradeLevel'];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface StudentListFilters {
  coachId?: number;
  gradeLevel?: StudentProfileRow['gradeLevel'];
  city?: StudentProfileRow['city'];
  search?: string;
  deletedStatus: ListStudentsQueryDto['deletedStatus'];
}

export type AssignedCoachRow = {
  id: number;
  fullName: string;
  phone: string;
};

export type TodayTaskRow = {
  id: number;
  title: string;
  subject: string;
  status: string;
  sessionsCount: number;
};

@Injectable()
export class StudentsRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async findUserRoleById(userId: number): Promise<AppRole | undefined> {
    const record = await this.database.query.users.findFirst({
      columns: { role: true },
      where: eq(users.id, userId),
    });

    return record?.role as AppRole | undefined;
  }

  async findByUserId(userId: number): Promise<StudentAggregate | undefined> {
    const [student] = await this.baseStudentSelect()
      .where(eq(studentProfiles.userId, userId))
      .limit(1);

    return student;
  }

  async listAssignedCoaches(studentId: number): Promise<AssignedCoachRow[]> {
    const rows = await this.database
      .select({
        id: users.id,
        fullName: users.fullName,
        phone: users.phone,
      })
      .from(coachAssignments)
      .innerJoin(users, eq(coachAssignments.coachId, users.id))
      .where(
        and(eq(coachAssignments.studentId, studentId), eq(users.role, 'coach')),
      )
      .orderBy(desc(coachAssignments.assignedAt));

    return rows;
  }

  async isCoachAssignedToStudent(
    studentId: number,
    coachId: number,
  ): Promise<boolean> {
    const record = await this.database.query.coachAssignments.findFirst({
      where: and(
        eq(coachAssignments.studentId, studentId),
        eq(coachAssignments.coachId, coachId),
      ),
    });

    return Boolean(record);
  }

  async assignCoachToStudent(studentId: number, coachId: number) {
    // Idempotent insert; unique(coachId, studentId) prevents duplicates.
    await this.database
      .insert(coachAssignments)
      .values({ studentId, coachId })
      .onConflictDoNothing();

    return { ok: true };
  }

  async removeCoachFromStudent(studentId: number, coachId: number) {
    await this.database
      .delete(coachAssignments)
      .where(
        and(
          eq(coachAssignments.studentId, studentId),
          eq(coachAssignments.coachId, coachId),
        ),
      );

    return { ok: true };
  }

  async listTodayTasks(studentId: number): Promise<TodayTaskRow[]> {
    // "Today" is based on the DB server timezone via current_date.
    // This is consistent and cheap; we can refine to Cairo-local later if needed.
    const rows = await this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        subject: tasks.subject,
        status: tasks.status,
        sessionsCount: sql<number>`count(${taskSessions.id})`,
      })
      .from(tasks)
      .innerJoin(plans, eq(tasks.planId, plans.id))
      .leftJoin(taskSessions, eq(taskSessions.taskId, tasks.id))
      .where(
        and(
          eq(plans.studentId, studentId),
          isNotNull(tasks.dueAt),
          eq(tasks.dueAt, sql`current_date`)
        ),
      )
      .groupBy(tasks.id)
      .orderBy(desc(tasks.dueAt), desc(tasks.id));

    return rows.map((r) => ({
      ...r,
      sessionsCount: Number(r.sessionsCount),
    }));
  }

  async listStudents(page: number, limit: number, filters: StudentListFilters) {
    const offset = (page - 1) * limit;
    const whereClause = this.buildListWhereClause(filters);
    const hasCoachFilter = filters.coachId !== undefined;

    const items = hasCoachFilter
      ? await this.database
          .select({
            id: users.id,
            fullName: users.fullName,
            phone: users.phone,
            role: users.role,
            city: studentProfiles.city,
            parentPhone: studentProfiles.parentPhone,
            gradeLevel: studentProfiles.gradeLevel,
            createdAt: studentProfiles.createdAt,
            updatedAt: studentProfiles.updatedAt,
            deletedAt: users.deletedAt,
          })
          .from(studentProfiles)
          .innerJoin(users, eq(studentProfiles.userId, users.id))
          .innerJoin(
            coachAssignments,
            eq(coachAssignments.studentId, studentProfiles.userId),
          )
          .where(whereClause)
          .orderBy(desc(studentProfiles.createdAt))
          .limit(limit)
          .offset(offset)
      : await this.baseStudentSelect()
          .where(whereClause)
          .orderBy(desc(studentProfiles.createdAt))
          .limit(limit)
          .offset(offset);

    const [{ total }] = hasCoachFilter
      ? await this.database
          .select({ total: count() })
          .from(studentProfiles)
          .innerJoin(users, eq(studentProfiles.userId, users.id))
          .innerJoin(
            coachAssignments,
            eq(coachAssignments.studentId, studentProfiles.userId),
          )
          .where(whereClause)
      : await this.database
          .select({ total: count() })
          .from(studentProfiles)
          .innerJoin(users, eq(studentProfiles.userId, users.id))
          .where(whereClause);

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async createProfile(values: typeof studentProfiles.$inferInsert) {
    const [profile] = await this.database
      .insert(studentProfiles)
      .values(values)
      .returning();

    return profile;
  }

  async updateProfileByUserId(
    userId: number,
    values: Partial<typeof studentProfiles.$inferInsert>,
  ) {
    const [profile] = await this.database
      .update(studentProfiles)
      .set(values)
      .where(eq(studentProfiles.userId, userId))
      .returning();

    return profile;
  }

  private baseStudentSelect() {
    return this.database
      .select({
        id: users.id,
        fullName: users.fullName,
        phone: users.phone,
        role: users.role,
        city: studentProfiles.city,
        parentPhone: studentProfiles.parentPhone,
        gradeLevel: studentProfiles.gradeLevel,
        createdAt: studentProfiles.createdAt,
        updatedAt: studentProfiles.updatedAt,
        deletedAt: users.deletedAt,
      })
      .from(studentProfiles)
      .innerJoin(users, eq(studentProfiles.userId, users.id));
  }

  private buildListWhereClause(filters: StudentListFilters): SQL | undefined {
    const conditions: SQL[] = [eq(users.role, 'student')];

    if (filters.coachId !== undefined) {
      conditions.push(eq(coachAssignments.coachId, filters.coachId));
    }

    if (filters.gradeLevel) {
      conditions.push(eq(studentProfiles.gradeLevel, filters.gradeLevel));
    }

    if (filters.city) {
      conditions.push(eq(studentProfiles.city, filters.city));
    }

    if (filters.search?.trim()) {
      const rawSearch = filters.search.trim();
      const normalizedPhoneSearch = rawSearch.replace(/\D/g, '');
      const isNumericSearch = normalizedPhoneSearch.length > 0;

      if (isNumericSearch) {
        conditions.push(ilike(users.phone, `%${normalizedPhoneSearch}%`));
      } else {
        conditions.push(ilike(users.fullName, `%${rawSearch}%`));
      }
    }

    if (filters.deletedStatus === 'active') {
      conditions.push(isNull(users.deletedAt));
    } else if (filters.deletedStatus === 'deleted') {
      conditions.push(isNotNull(users.deletedAt));
    }

    return and(...conditions);
  }
}
