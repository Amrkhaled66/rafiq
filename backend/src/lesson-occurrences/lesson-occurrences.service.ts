import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  addIsoDateDays,
  getCairoDateString,
  getIsoDateWeekday,
} from '../common/dates/cairo-date';
import {
  LessonOccurrencesRepository,
  type LessonForOccurrenceGeneration,
  type NewLessonOccurrence,
  type SubscriptionForOccurrenceGeneration,
} from './lesson-occurrences.repository';

@Injectable()
export class LessonOccurrencesService {
  constructor(
    private readonly lessonOccurrencesRepository: LessonOccurrencesRepository,
  ) {}

  @Cron('5 0 * * *', { timeZone: 'Africa/Cairo' })
  synchronizeDailyOccurrences() {
    return this.markPastScheduledMissed();
  }

  markPastScheduledMissed() {
    return this.lessonOccurrencesRepository.markPastScheduledMissed(
      getCairoDateString(),
    );
  }

  hasActiveOrUpcomingSubscription(studentId: number) {
    return this.lessonOccurrencesRepository.hasActiveOrUpcomingSubscription(
      studentId,
      getCairoDateString(),
    );
  }

  async generateForLesson(lessonId: number) {
    const lesson =
      await this.lessonOccurrencesRepository.findLessonForGeneration(lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const subscriptions =
      await this.lessonOccurrencesRepository.listSubscriptionsForLesson(lesson);

    await this.lessonOccurrencesRepository.insertOccurrences(
      this.buildOccurrences(lesson, subscriptions),
    );
  }

  async generateForSubscription(subscriptionId: number) {
    const subscription =
      await this.lessonOccurrencesRepository.findSubscriptionForGeneration(
        subscriptionId,
      );

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const lessons =
      await this.lessonOccurrencesRepository.listLessonsForSubscription(
        subscription,
      );

    const occurrences = lessons.flatMap((lesson) =>
      this.buildOccurrences(lesson, [subscription]),
    );

    await this.lessonOccurrencesRepository.insertOccurrences(occurrences);
  }

  private buildOccurrences(
    lesson: LessonForOccurrenceGeneration,
    subscriptions: SubscriptionForOccurrenceGeneration[],
  ) {
    const today = getCairoDateString();
    const occurrences: NewLessonOccurrence[] = [];

    for (const subscription of subscriptions) {
      const firstDate =
        subscription.startsAt > lesson.trackingStartsOn
          ? subscription.startsAt
          : lesson.trackingStartsOn;

      if (firstDate > subscription.endsAt) {
        continue;
      }

      const values: NewLessonOccurrence[] = [];

      for (
        let date = firstDate;
        date <= subscription.endsAt;
        date = addIsoDateDays(date, 1)
      ) {
        if (getIsoDateWeekday(date) !== lesson.weekday) {
          continue;
        }

        values.push({
          lessonId: lesson.id,
          subscriptionId: subscription.id,
          studentId: lesson.studentId,
          lessonName: lesson.name,
          subject: lesson.subject,
          scheduledForDate: date,
          scheduledWeekday: lesson.weekday,
          status: date < today ? 'missed' : 'scheduled',
        });
      }

      occurrences.push(...values);
    }

    return occurrences;
  }

  async listStudentOccurrencesInRange(input: {
    studentId: number;
    from: string;
    to: string;
  }) {
    return this.lessonOccurrencesRepository.listStudentOccurrencesInRange(
      input,
    );
  }

  async watchOccurrence(studentId: number, occurrenceId: number) {
    const occurrence = await this.findOccurrenceOrThrow(
      studentId,
      occurrenceId,
    );
    const today = getCairoDateString();

    if (occurrence.scheduledForDate > today) {
      throw new BadRequestException('Future lessons cannot be watched');
    }

    if (
      occurrence.status === 'watched_on_time' ||
      occurrence.status === 'watched_late'
    ) {
      return {
        ok: true as const,
        status: occurrence.status,
        alreadyMarked: true,
      };
    }

    const watchedOnTime = occurrence.scheduledForDate === today;
    await this.lessonOccurrencesRepository.markWatched({
      occurrenceId: occurrence.id,
      watchedOn: today,
      watchedOnTime,
    });

    return {
      ok: true as const,
      status: watchedOnTime
        ? ('watched_on_time' as const)
        : ('watched_late' as const),
      alreadyMarked: false,
    };
  }

  async unwatchOccurrence(studentId: number, occurrenceId: number) {
    const occurrence = await this.findOccurrenceOrThrow(
      studentId,
      occurrenceId,
    );
    const today = getCairoDateString();
    const nextStatus =
      occurrence.scheduledForDate < today
        ? ('missed' as const)
        : ('scheduled' as const);

    await this.lessonOccurrencesRepository.unmarkWatched({
      occurrenceId,
      nextStatus,
    });

    return { ok: true as const, status: nextStatus };
  }

  async watchLessonForDate(
    studentId: number,
    lessonId: number,
    scheduledForDate: string,
  ) {
    const occurrence =
      await this.lessonOccurrencesRepository.findByLessonAndDate(
        lessonId,
        studentId,
        scheduledForDate,
      );

    if (!occurrence) {
      throw new NotFoundException('Lesson occurrence not found');
    }

    return this.watchOccurrence(studentId, occurrence.id);
  }

  async unwatchLessonForDate(
    studentId: number,
    lessonId: number,
    scheduledForDate: string,
  ) {
    const occurrence =
      await this.lessonOccurrencesRepository.findByLessonAndDate(
        lessonId,
        studentId,
        scheduledForDate,
      );

    if (!occurrence) {
      return { ok: true as const, removed: false };
    }

    await this.unwatchOccurrence(studentId, occurrence.id);
    return { ok: true as const, removed: true };
  }

  resetFutureOccurrences(lessonId: number) {
    return this.lessonOccurrencesRepository.resetFutureOccurrences(
      lessonId,
      getCairoDateString(),
    );
  }

  hasHistoricalOccurrences(lessonId: number) {
    return this.lessonOccurrencesRepository.hasHistoricalOccurrences(
      lessonId,
      getCairoDateString(),
    );
  }

  deleteFutureScheduledOccurrences(lessonId: number) {
    return this.lessonOccurrencesRepository.deleteFutureScheduledOccurrences(
      lessonId,
      getCairoDateString(),
    );
  }

  private async findOccurrenceOrThrow(studentId: number, occurrenceId: number) {
    const occurrence =
      await this.lessonOccurrencesRepository.findByIdAndStudent(
        occurrenceId,
        studentId,
      );

    if (!occurrence) {
      throw new NotFoundException('Lesson occurrence not found');
    }

    return occurrence;
  }
}
