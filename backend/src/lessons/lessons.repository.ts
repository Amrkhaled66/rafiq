import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { lessonOccurrences, lessons } from '../db';

type LessonRow = typeof lessons.$inferSelect;

export type TodayLessonRow = {
  id: number;
  occurrenceId: number;
  name: string;
  subject: string;
  weekday: string;
  checked: boolean;
  watchedOn: string | null;
  occurrenceStatus: string;
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
        occurrenceId: lessonOccurrences.id,
        name: lessons.name,
        subject: lessons.subject,
        weekday: lessons.weekday,
        watchedOn: lessonOccurrences.watchedOn,
        occurrenceStatus: lessonOccurrences.status,
      })
      .from(lessons)
      .innerJoin(
        lessonOccurrences,
        and(
          eq(lessonOccurrences.lessonId, lessons.id),
          eq(lessonOccurrences.studentId, studentId),
          eq(lessonOccurrences.scheduledForDate, scheduledForDate),
        ),
      )
      .where(
        and(eq(lessons.studentId, studentId), eq(lessons.weekday, weekday)),
      )
      .orderBy(desc(lessons.id));

    return rows.map((row) => ({
      id: row.id,
      occurrenceId: row.occurrenceId,
      name: row.name,
      subject: row.subject,
      weekday: row.weekday,
      checked: Boolean(row.watchedOn),
      watchedOn: row.watchedOn,
      occurrenceStatus: row.occurrenceStatus,
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
}
