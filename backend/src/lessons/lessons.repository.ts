import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, gte, isNull, lt, lte, sql } from 'drizzle-orm';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { lessons, lessonWatches } from '../db';

type LessonRow = typeof lessons.$inferSelect;
type LessonWatchRow = typeof lessonWatches.$inferSelect;

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
      orderBy: [desc(lessons.scheduledAt), desc(lessons.id)],
    });
  }

  async createLesson(input: {
    studentId: number;
    name: string;
    subject: LessonRow['subject'];
    scheduledAt: string;
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
    values: Partial<Pick<LessonRow, 'name' | 'subject' | 'scheduledAt'>>,
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

  async findWatchByLessonAndStudent(
    lessonId: number,
    studentId: number,
  ): Promise<LessonWatchRow | undefined> {
    return this.database.query.lessonWatches.findFirst({
      where: and(
        eq(lessonWatches.lessonId, lessonId),
        eq(lessonWatches.studentId, studentId),
      ),
    });
  }

  async markLessonWatched(input: {
    lessonId: number;
    studentId: number;
    scheduledOn: string;
    watchedOn: string;
  }): Promise<boolean> {
    const inserted = await this.database
      .insert(lessonWatches)
      .values(input)
      .onConflictDoNothing()
      .returning({ id: lessonWatches.id });

    return inserted.length > 0;
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
        lessonName: lessons.name,
        subject: lessons.subject,
        scheduledAt: lessons.scheduledAt,
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
    const watchedLessonIdsSubquery = this.database
      .select({
        lessonId: lessonWatches.lessonId,
      })
      .from(lessonWatches)
      .where(eq(lessonWatches.studentId, studentId))
      .as('watched_lesson_ids');

    return this.database
      .select({
        id: lessons.id,
        name: lessons.name,
        subject: lessons.subject,
        scheduledAt: lessons.scheduledAt,
      })
      .from(lessons)
      .leftJoin(
        watchedLessonIdsSubquery,
        eq(lessons.id, watchedLessonIdsSubquery.lessonId),
      )
      .where(
        and(
          eq(lessons.studentId, studentId),
          gte(lessons.scheduledAt, from),
          lte(lessons.scheduledAt, to),
          lt(lessons.scheduledAt, sql`current_date`),
          isNull(watchedLessonIdsSubquery.lessonId),
        ),
      );
  }

  async getCompletionStats(
    studentId: number,
    from: string,
    to: string,
  ): Promise<{ totalScheduledLessons: number; watchedLessons: number }> {
    const [stats] = await this.database
      .select({
        totalScheduledLessons: sql<number>`count(distinct ${lessons.id})`,
        watchedLessons: sql<number>`count(${lessonWatches.id})`,
      })
      .from(lessons)
      .leftJoin(
        lessonWatches,
        and(
          eq(lessonWatches.lessonId, lessons.id),
          eq(lessonWatches.studentId, studentId),
        ),
      )
      .where(
        and(
          eq(lessons.studentId, studentId),
          gte(lessons.scheduledAt, from),
          lte(lessons.scheduledAt, to),
        ),
      );

    return {
      totalScheduledLessons: Number(stats?.totalScheduledLessons ?? 0),
      watchedLessons: Number(stats?.watchedLessons ?? 0),
    };
  }
}
