import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { lessons, lessonWatches } from '../db';

type LessonRow = typeof lessons.$inferSelect;
type LessonWatchRow = typeof lessonWatches.$inferSelect;

export type TodayLessonRow = {
  id: number;
  name: string;
  subject: string;
  weekday: string;
  checked: boolean;
  watchedOn: string | null;
};

@Injectable()
export class LessonsRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async findLessonByIdAndStudent(
    lessonId: number,
    studentId: number,
  ): Promise<LessonRow | undefined> {
    return this.database.query.lessons.findFirst({
      where: and(eq(lessons.id, lessonId), eq(lessons.studentId, studentId)),
    });
  }

  async listLessonsByStudent(studentId: number): Promise<LessonRow[]> {
    return this.database.query.lessons.findMany({
      where: eq(lessons.studentId, studentId),
      orderBy: [lessons.weekday, desc(lessons.id)],
    });
  }

  async listTodayLessonsByStudent(
    studentId: number,
    weekday: LessonRow['weekday'],
    scheduledForDate: string,
  ): Promise<TodayLessonRow[]> {
    const rows = await this.database
      .select({
        id: lessons.id,
        name: lessons.name,
        subject: lessons.subject,
        weekday: lessons.weekday,
        watchedOn: lessonWatches.watchedOn,
      })
      .from(lessons)
      .leftJoin(
        lessonWatches,
        and(
          eq(lessonWatches.lessonId, lessons.id),
          eq(lessonWatches.studentId, studentId),
          eq(lessonWatches.scheduledForDate, scheduledForDate),
        ),
      )
      .where(and(eq(lessons.studentId, studentId), eq(lessons.weekday, weekday)))
      .orderBy(desc(lessons.id));

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      subject: row.subject,
      weekday: row.weekday,
      checked: Boolean(row.watchedOn),
      watchedOn: row.watchedOn,
    }));
  }

  async createLesson(input: {
    studentId: number;
    name: string;
    subject: LessonRow['subject'];
    weekday: LessonRow['weekday'];
  }): Promise<LessonRow> {
    const [lesson] = await this.database
      .insert(lessons)
      .values(input)
      .returning();

    return lesson;
  }

  async updateLessonById(
    lessonId: number,
    studentId: number,
    values: Partial<Pick<LessonRow, 'name' | 'subject' | 'weekday'>>,
  ): Promise<LessonRow | undefined> {
    const [lesson] = await this.database
      .update(lessons)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(and(eq(lessons.id, lessonId), eq(lessons.studentId, studentId)))
      .returning();

    return lesson;
  }

  async deleteLessonById(
    lessonId: number,
    studentId: number,
  ): Promise<boolean> {
    const deleted = await this.database
      .delete(lessons)
      .where(and(eq(lessons.id, lessonId), eq(lessons.studentId, studentId)))
      .returning({ id: lessons.id });

    return deleted.length > 0;
  }

  async hasWatchHistory(lessonId: number, studentId: number): Promise<boolean> {
    const record = await this.database.query.lessonWatches.findFirst({
      where: and(
        eq(lessonWatches.lessonId, lessonId),
        eq(lessonWatches.studentId, studentId),
      ),
      columns: { id: true },
    });

    return Boolean(record);
  }

  async findWatchByLessonAndScheduledDate(
    lessonId: number,
    studentId: number,
    scheduledForDate: string,
  ): Promise<LessonWatchRow | undefined> {
    return this.database.query.lessonWatches.findFirst({
      where: and(
        eq(lessonWatches.lessonId, lessonId),
        eq(lessonWatches.studentId, studentId),
        eq(lessonWatches.scheduledForDate, scheduledForDate),
      ),
    });
  }

  async markLessonWatched(input: {
    lessonId: number;
    studentId: number;
    scheduledForDate: string;
    scheduledWeekday: LessonWatchRow['scheduledWeekday'];
    watchedOn: string;
    watchedOnTime: boolean;
  }): Promise<boolean> {
    const inserted = await this.database
      .insert(lessonWatches)
      .values(input)
      .onConflictDoNothing()
      .returning({ id: lessonWatches.id });

    return inserted.length > 0;
  }

  async deleteWatchByLessonAndScheduledDate(
    lessonId: number,
    studentId: number,
    scheduledForDate: string,
  ): Promise<boolean> {
    const deleted = await this.database
      .delete(lessonWatches)
      .where(
        and(
          eq(lessonWatches.lessonId, lessonId),
          eq(lessonWatches.studentId, studentId),
          eq(lessonWatches.scheduledForDate, scheduledForDate),
        ),
      )
      .returning({ id: lessonWatches.id });

    return deleted.length > 0;
  }

  async listWatchedLessonsInRange(
    studentId: number,
    from: string,
    to: string,
  ) {
    return this.database
      .select({
        lessonId: lessonWatches.lessonId,
        studentId: lessonWatches.studentId,
        watchedOn: lessonWatches.watchedOn,
        watchedOnTime: lessonWatches.watchedOnTime,
        scheduledForDate: lessonWatches.scheduledForDate,
        scheduledWeekday: lessonWatches.scheduledWeekday,
        lessonName: lessons.name,
        subject: lessons.subject,
        weekday: lessons.weekday,
      })
      .from(lessonWatches)
      .innerJoin(lessons, eq(lessonWatches.lessonId, lessons.id))
      .where(
        and(
          eq(lessonWatches.studentId, studentId),
          gte(lessonWatches.watchedOn, from),
          lte(lessonWatches.watchedOn, to),
        ),
      );
  }

  async countWatchedLessonsInRange(
    studentId: number,
    from: string,
    to: string,
  ): Promise<number> {
    const [result] = await this.database
      .select({ total: count() })
      .from(lessonWatches)
      .where(
        and(
          eq(lessonWatches.studentId, studentId),
          gte(lessonWatches.watchedOn, from),
          lte(lessonWatches.watchedOn, to),
        ),
      );

    return Number(result?.total ?? 0);
  }

  async listMissedLessonsInRange(
    studentId: number,
    from: string,
    to: string,
  ) {
    const watchedDatesSubquery = this.database
      .select({
        lessonId: lessonWatches.lessonId,
        scheduledForDate: lessonWatches.scheduledForDate,
      })
      .from(lessonWatches)
      .where(eq(lessonWatches.studentId, studentId))
      .as('watched_dates');

    return this.database
      .select({
        id: lessons.id,
        name: lessons.name,
        subject: lessons.subject,
        weekday: lessons.weekday,
      })
      .from(lessons)
      .leftJoin(
        watchedDatesSubquery,
        eq(lessons.id, watchedDatesSubquery.lessonId),
      )
      .where(
        and(
          eq(lessons.studentId, studentId),
          isNull(watchedDatesSubquery.lessonId),
          sql`${from} <= ${to}`,
        ),
      );
  }

  async getCompletionStats(
    studentId: number,
    from: string,
    to: string,
  ): Promise<{ watchedLessons: number }> {
    const [stats] = await this.database
      .select({
        watchedLessons: sql<number>`count(${lessonWatches.id})`,
      })
      .from(lessonWatches)
      .where(
        and(
          eq(lessonWatches.studentId, studentId),
          gte(lessonWatches.watchedOn, from),
          lte(lessonWatches.watchedOn, to),
        ),
      );

    return {
      watchedLessons: Number(stats?.watchedLessons ?? 0),
    };
  }
}
