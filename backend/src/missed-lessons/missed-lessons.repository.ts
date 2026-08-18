import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  sql,
  type SQL,
} from 'drizzle-orm';
import {
  coachAssignments,
  lessonOccurrences,
  missedLessonResolutions,
  users,
} from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

type MissedLessonsScope = {
  role: 'coach' | 'super_admin';
  userId: number;
  coachId?: number;
};

@Injectable()
export class MissedLessonsRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async listMissedLessons(
    input: MissedLessonsScope & {
      page: number;
      limit: number;
      from?: string;
      to?: string;
      status?: 'resolved' | 'unresolved';
      watchStatus?: 'unwatched' | 'watched_late';
      studentPhone?: string;
      studentId?: number;
    },
  ) {
    const conditions = this.buildConditions(input);
    const offset = (input.page - 1) * input.limit;

    const items = await this.database
      .select({
        occurrenceId: lessonOccurrences.id,
        lessonId: lessonOccurrences.lessonId,
        lessonName: lessonOccurrences.lessonName,
        subject: lessonOccurrences.subject,
        studentId: lessonOccurrences.studentId,
        studentName: users.fullName,
        scheduledForDate: lessonOccurrences.scheduledForDate,
        scheduledWeekday: lessonOccurrences.scheduledWeekday,
        occurrenceStatus: lessonOccurrences.status,
        watchedOn: lessonOccurrences.watchedOn,
        isResolved: sql<boolean>`${missedLessonResolutions.id} is not null`,
        resolvedAt: missedLessonResolutions.resolvedAt,
        resolvedByName: sql<string | null>`resolver_users.full_name`,
        resolutionNote: missedLessonResolutions.note,
        assignedCoaches: sql<Array<{ id: number; name: string }>>`
          coalesce(
            (
              select json_agg(
                json_build_object('id', ca.coach_id, 'name', coach_users.full_name)
                order by coach_users.full_name
              )
              from coach_assignments ca
              inner join users coach_users on coach_users.id = ca.coach_id
              where ca.student_id = ${lessonOccurrences.studentId}
            ),
            '[]'::json
          )
        `,
      })
      .from(lessonOccurrences)
      .innerJoin(users, eq(lessonOccurrences.studentId, users.id))
      .leftJoin(
        missedLessonResolutions,
        eq(missedLessonResolutions.occurrenceId, lessonOccurrences.id),
      )
      .leftJoin(
        sql`users as resolver_users`,
        sql`resolver_users.id = ${missedLessonResolutions.resolvedBy}`,
      )
      .where(and(...conditions))
      .orderBy(
        desc(lessonOccurrences.scheduledForDate),
        desc(lessonOccurrences.id),
      )
      .limit(input.limit)
      .offset(offset);

    const [{ total }] = await this.database
      .select({ total: count() })
      .from(lessonOccurrences)
      .leftJoin(
        missedLessonResolutions,
        eq(missedLessonResolutions.occurrenceId, lessonOccurrences.id),
      )
      .where(and(...conditions));

    return {
      items,
      page: input.page,
      limit: input.limit,
      total: Number(total ?? 0),
    };
  }

  async getStats(input: MissedLessonsScope) {
    const conditions = this.buildConditions(input, false);
    const [stats] = await this.database
      .select({
        totalMissed: count(lessonOccurrences.id),
        totalUnwatched: sql<number>`count(${lessonOccurrences.id}) filter (where ${lessonOccurrences.status} = 'missed')`,
        totalWatchedLate: sql<number>`count(${lessonOccurrences.id}) filter (where ${lessonOccurrences.status} = 'watched_late')`,
        totalResolved: sql<number>`count(${lessonOccurrences.id}) filter (where ${missedLessonResolutions.id} is not null)`,
        totalUnresolved: sql<number>`count(${lessonOccurrences.id}) filter (where ${missedLessonResolutions.id} is null)`,
      })
      .from(lessonOccurrences)
      .leftJoin(
        missedLessonResolutions,
        eq(missedLessonResolutions.occurrenceId, lessonOccurrences.id),
      )
      .where(and(...conditions));

    return {
      totalMissed: Number(stats?.totalMissed ?? 0),
      totalUnwatched: Number(stats?.totalUnwatched ?? 0),
      totalWatchedLate: Number(stats?.totalWatchedLate ?? 0),
      totalResolved: Number(stats?.totalResolved ?? 0),
      totalUnresolved: Number(stats?.totalUnresolved ?? 0),
    };
  }

  findMissedOccurrence(occurrenceId: number) {
    return this.database.query.lessonOccurrences.findFirst({
      where: and(
        eq(lessonOccurrences.id, occurrenceId),
        inArray(lessonOccurrences.status, ['missed', 'watched_late']),
      ),
      columns: { id: true, studentId: true },
    });
  }

  async isCoachAssigned(studentId: number, coachId: number) {
    const assignment = await this.database.query.coachAssignments.findFirst({
      where: and(
        eq(coachAssignments.studentId, studentId),
        eq(coachAssignments.coachId, coachId),
      ),
      columns: { id: true },
    });

    return Boolean(assignment);
  }

  async resolve(occurrenceId: number, resolvedBy: number, note: string) {
    await this.database
      .insert(missedLessonResolutions)
      .values({ occurrenceId, resolvedBy, note })
      .onConflictDoUpdate({
        target: missedLessonResolutions.occurrenceId,
        set: {
          resolvedBy,
          note,
          resolvedAt: new Date(),
          updatedAt: new Date(),
        },
      });
  }

  async unresolve(occurrenceId: number) {
    const deleted = await this.database
      .delete(missedLessonResolutions)
      .where(eq(missedLessonResolutions.occurrenceId, occurrenceId))
      .returning({ id: missedLessonResolutions.id });

    return deleted.length > 0;
  }

  private buildConditions(
    input: MissedLessonsScope & {
      from?: string;
      to?: string;
      status?: 'resolved' | 'unresolved';
      watchStatus?: 'unwatched' | 'watched_late';
      studentPhone?: string;
      studentId?: number;
    },
    includeFilters = true,
  ): SQL[] {
    const coachId = input.role === 'coach' ? input.userId : input.coachId;
    const conditions: SQL[] = [
      inArray(lessonOccurrences.status, ['missed', 'watched_late']),
    ];

    if (coachId) {
      conditions.push(
        exists(
          this.database
            .select({ id: coachAssignments.id })
            .from(coachAssignments)
            .where(
              and(
                eq(coachAssignments.studentId, lessonOccurrences.studentId),
                eq(coachAssignments.coachId, coachId),
              ),
            ),
        ),
      );
    }

    if (!includeFilters) {
      return conditions;
    }

    if (input.from) {
      conditions.push(gte(lessonOccurrences.scheduledForDate, input.from));
    }
    if (input.to) {
      conditions.push(lte(lessonOccurrences.scheduledForDate, input.to));
    }
    if (input.watchStatus) {
      conditions.push(
        eq(
          lessonOccurrences.status,
          input.watchStatus === 'unwatched' ? 'missed' : 'watched_late',
        ),
      );
    }
    if (input.status === 'resolved') {
      conditions.push(sql`${missedLessonResolutions.id} is not null`);
    } else if (input.status === 'unresolved') {
      conditions.push(sql`${missedLessonResolutions.id} is null`);
    }

    if (input.studentPhone?.trim()) {
      conditions.push(
        ilike(users.phone, `%${input.studentPhone.trim()}%`),
      );
    }

    if (input.studentId) {
      conditions.push(eq(lessonOccurrences.studentId, input.studentId));
    }

    return conditions;
  }
}
