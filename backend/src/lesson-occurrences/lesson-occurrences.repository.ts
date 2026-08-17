import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, gte, inArray, isNull, lt, lte, or } from 'drizzle-orm';
import { lessonOccurrences, lessons, subscriptions } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

export type LessonOccurrenceStatus =
  | 'scheduled'
  | 'watched_on_time'
  | 'missed'
  | 'watched_late';

export type NewLessonOccurrence = typeof lessonOccurrences.$inferInsert;

export type LessonForOccurrenceGeneration = {
  id: number;
  studentId: number;
  name: string;
  subject: NewLessonOccurrence['subject'];
  weekday: NewLessonOccurrence['scheduledWeekday'];
  trackingStartsOn: string;
};

export type SubscriptionForOccurrenceGeneration = {
  id: number;
  studentId: number;
  startsAt: string;
  endsAt: string;
};

@Injectable()
export class LessonOccurrencesRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async insertOccurrences(values: NewLessonOccurrence[]) {
    if (!values.length) {
      return;
    }

    const chunkSize = 500;

    for (let index = 0; index < values.length; index += chunkSize) {
      await this.database
        .insert(lessonOccurrences)
        .values(values.slice(index, index + chunkSize))
        .onConflictDoNothing();
    }
  }

  findLessonForGeneration(
    lessonId: number,
  ): Promise<LessonForOccurrenceGeneration | undefined> {
    return this.database.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      columns: {
        id: true,
        studentId: true,
        name: true,
        subject: true,
        weekday: true,
        trackingStartsOn: true,
      },
    });
  }

  findSubscriptionForGeneration(
    subscriptionId: number,
  ): Promise<SubscriptionForOccurrenceGeneration | undefined> {
    return this.database.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.id, subscriptionId),
        isNull(subscriptions.cancelledAt),
      ),
      columns: {
        id: true,
        studentId: true,
        startsAt: true,
        endsAt: true,
      },
    });
  }

  listSubscriptionsForLesson(
    lesson: LessonForOccurrenceGeneration,
  ): Promise<SubscriptionForOccurrenceGeneration[]> {
    return this.database
      .select({
        id: subscriptions.id,
        studentId: subscriptions.studentId,
        startsAt: subscriptions.startsAt,
        endsAt: subscriptions.endsAt,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.studentId, lesson.studentId),
          isNull(subscriptions.cancelledAt),
          gte(subscriptions.endsAt, lesson.trackingStartsOn),
        ),
      )
      .orderBy(subscriptions.startsAt, subscriptions.id);
  }

  listLessonsForSubscription(
    subscription: SubscriptionForOccurrenceGeneration,
  ): Promise<LessonForOccurrenceGeneration[]> {
    return this.database
      .select({
        id: lessons.id,
        studentId: lessons.studentId,
        name: lessons.name,
        subject: lessons.subject,
        weekday: lessons.weekday,
        trackingStartsOn: lessons.trackingStartsOn,
      })
      .from(lessons)
      .where(
        and(
          eq(lessons.studentId, subscription.studentId),
          lte(lessons.trackingStartsOn, subscription.endsAt),
        ),
      )
      .orderBy(lessons.id);
  }

  async hasActiveOrUpcomingSubscription(studentId: number, today: string) {
    const subscription = await this.database.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.studentId, studentId),
        isNull(subscriptions.cancelledAt),
        gte(subscriptions.endsAt, today),
      ),
      columns: { id: true },
    });

    return Boolean(subscription);
  }

  markPastScheduledMissed(today: string) {
    return this.database
      .update(lessonOccurrences)
      .set({ status: 'missed', updatedAt: new Date() })
      .where(
        and(
          eq(lessonOccurrences.status, 'scheduled'),
          lt(lessonOccurrences.scheduledForDate, today),
        ),
      );
  }

  listStudentOccurrencesInRange(input: {
    studentId: number;
    from: string;
    to: string;
  }) {
    return this.database
      .select()
      .from(lessonOccurrences)
      .where(
        and(
          eq(lessonOccurrences.studentId, input.studentId),
          gte(lessonOccurrences.scheduledForDate, input.from),
          lte(lessonOccurrences.scheduledForDate, input.to),
        ),
      )
      .orderBy(lessonOccurrences.scheduledForDate, lessonOccurrences.id);
  }

  findByIdAndStudent(occurrenceId: number, studentId: number) {
    return this.database.query.lessonOccurrences.findFirst({
      where: and(
        eq(lessonOccurrences.id, occurrenceId),
        eq(lessonOccurrences.studentId, studentId),
      ),
    });
  }

  findByLessonAndDate(
    lessonId: number,
    studentId: number,
    scheduledForDate: string,
  ) {
    return this.database.query.lessonOccurrences.findFirst({
      where: and(
        eq(lessonOccurrences.lessonId, lessonId),
        eq(lessonOccurrences.studentId, studentId),
        eq(lessonOccurrences.scheduledForDate, scheduledForDate),
      ),
    });
  }

  async markWatched(input: {
    occurrenceId: number;
    watchedOn: string;
    watchedOnTime: boolean;
  }) {
    await this.database
      .update(lessonOccurrences)
      .set({
        status: input.watchedOnTime ? 'watched_on_time' : 'watched_late',
        watchedOn: input.watchedOn,
        updatedAt: new Date(),
      })
      .where(eq(lessonOccurrences.id, input.occurrenceId));
  }

  async unmarkWatched(input: {
    occurrenceId: number;
    nextStatus: 'scheduled' | 'missed';
  }) {
    await this.database
      .update(lessonOccurrences)
      .set({
        status: input.nextStatus,
        watchedOn: null,
        updatedAt: new Date(),
      })
      .where(eq(lessonOccurrences.id, input.occurrenceId));
  }

  async resetFutureOccurrences(lessonId: number, today: string) {
    await this.deleteFutureScheduledOccurrences(lessonId, today);
  }

  async hasHistoricalOccurrences(lessonId: number, today: string) {
    const occurrence = await this.database.query.lessonOccurrences.findFirst({
      where: and(
        eq(lessonOccurrences.lessonId, lessonId),
        or(
          lte(lessonOccurrences.scheduledForDate, today),
          inArray(lessonOccurrences.status, [
            'watched_on_time',
            'missed',
            'watched_late',
          ]),
        ),
      ),
      columns: { id: true },
    });

    return Boolean(occurrence);
  }

  deleteFutureScheduledOccurrences(lessonId: number, today: string) {
    return this.database
      .delete(lessonOccurrences)
      .where(
        and(
          eq(lessonOccurrences.lessonId, lessonId),
          eq(lessonOccurrences.status, 'scheduled'),
          gt(lessonOccurrences.scheduledForDate, today),
        ),
      );
  }

  deleteFutureScheduledOccurrencesBySubscription(
    subscriptionId: number,
    today: string,
  ) {
    return this.database
      .delete(lessonOccurrences)
      .where(
        and(
          eq(lessonOccurrences.subscriptionId, subscriptionId),
          eq(lessonOccurrences.status, 'scheduled'),
          gt(lessonOccurrences.scheduledForDate, today),
        ),
      );
  }
}
