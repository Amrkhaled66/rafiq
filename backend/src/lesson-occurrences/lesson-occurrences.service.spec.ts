import { BadRequestException } from '@nestjs/common';
import { addIsoDateDays, getCairoDateString } from '../common/dates/cairo-date';
import type { LessonOccurrencesRepository } from './lesson-occurrences.repository';
import { LessonOccurrencesService } from './lesson-occurrences.service';

describe('LessonOccurrencesService', () => {
  const repository = {
    findLessonForGeneration: jest.fn(),
    findSubscriptionForGeneration: jest.fn(),
    listSubscriptionsForLesson: jest.fn(),
    listLessonsForSubscription: jest.fn(),
    hasActiveOrUpcomingSubscription: jest.fn(),
    insertOccurrences: jest.fn(),
    markPastScheduledMissed: jest.fn(),
    findByIdAndStudent: jest.fn(),
    markWatched: jest.fn(),
    unmarkWatched: jest.fn(),
  };
  const service = new LessonOccurrencesService(
    repository as unknown as LessonOccurrencesRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    repository.listSubscriptionsForLesson.mockResolvedValue([]);
    repository.listLessonsForSubscription.mockResolvedValue([]);
  });

  it('materializes matching weekly dates inside the lesson subscriptions', async () => {
    repository.findLessonForGeneration.mockResolvedValue({
      id: 4,
      studentId: 12,
      name: 'Physics lesson',
      subject: 'physics',
      weekday: 'monday',
      trackingStartsOn: '2026-08-17',
    });
    repository.listSubscriptionsForLesson.mockResolvedValue([
      {
        id: 6,
        studentId: 12,
        startsAt: '2026-08-17',
        endsAt: '2026-08-31',
      },
    ]);

    await service.generateForLesson(4);

    expect(repository.insertOccurrences).toHaveBeenCalledWith([
      expect.objectContaining({
        subscriptionId: 6,
        scheduledForDate: '2026-08-17',
      }),
      expect.objectContaining({
        subscriptionId: 6,
        scheduledForDate: '2026-08-24',
      }),
      expect.objectContaining({
        subscriptionId: 6,
        scheduledForDate: '2026-08-31',
      }),
    ]);
  });

  it('materializes all existing lessons for a new subscription', async () => {
    repository.findSubscriptionForGeneration.mockResolvedValue({
      id: 7,
      studentId: 12,
      startsAt: '2026-08-17',
      endsAt: '2026-08-24',
    });
    repository.listLessonsForSubscription.mockResolvedValue([
      {
        id: 4,
        studentId: 12,
        name: 'Physics lesson',
        subject: 'physics',
        weekday: 'monday',
        trackingStartsOn: '2026-08-20',
      },
    ]);

    await service.generateForSubscription(7);

    expect(repository.insertOccurrences).toHaveBeenCalledWith([
      expect.objectContaining({
        lessonId: 4,
        subscriptionId: 7,
        scheduledForDate: '2026-08-24',
      }),
    ]);
  });

  it('records a past missed occurrence as watched late', async () => {
    const scheduledForDate = addIsoDateDays(getCairoDateString(), -1);
    repository.findByIdAndStudent.mockResolvedValue({
      id: 9,
      lessonId: 4,
      studentId: 12,
      scheduledForDate,
      scheduledWeekday: 'monday',
      status: 'missed',
    });

    const result = await service.watchOccurrence(12, 9);

    expect(repository.markWatched).toHaveBeenCalledWith(
      expect.objectContaining({
        occurrenceId: 9,
        watchedOnTime: false,
      }),
    );
    expect(result.status).toBe('watched_late');
  });

  it('rejects watching a future occurrence', async () => {
    repository.findByIdAndStudent.mockResolvedValue({
      id: 9,
      lessonId: 4,
      studentId: 12,
      scheduledForDate: addIsoDateDays(getCairoDateString(), 1),
      scheduledWeekday: 'monday',
      status: 'scheduled',
    });

    await expect(service.watchOccurrence(12, 9)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.markWatched).not.toHaveBeenCalled();
  });
});
