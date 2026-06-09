import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { StudentsRepository } from '../students/students.repository';
import { LessonsRepository } from './lessons.repository';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

const LESSON_WEEKDAY_ORDER = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const;

type LessonWeekday = (typeof LESSON_WEEKDAY_ORDER)[number];

const JS_DAY_TO_LESSON_WEEKDAY: Record<number, LessonWeekday> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async listLessons(studentId: number, _actor: AuthenticatedUser) {
    await this.findStudentOrThrow(studentId);

    return this.lessonsRepository.listLessonsByStudent(studentId);
  }

  async getTodayLessons(studentId: number) {
    await this.findStudentOrThrow(studentId);

    const cairoNow = this.getCairoNow();
    const today = this.formatDateAsIso(cairoNow);
    const weekday = this.getLessonWeekdayFromDate(cairoNow);
    const lessons = await this.lessonsRepository.listTodayLessonsByStudent(
      studentId,
      weekday,
      today,
    );

    const attendedCount = lessons.filter((lesson) => lesson.checked).length;
    const totalCount = lessons.length;

    return {
      dateLabel: this.formatArabicDateLabel(cairoNow),
      progress: {
        percentage:
          totalCount === 0 ? 0 : Math.round((attendedCount / totalCount) * 100),
        completedCount: attendedCount,
        totalCount,
      },
      attendedCount,
      remainingCount: Math.max(totalCount - attendedCount, 0),
      lessons,
    };
  }

  async createLesson(
    studentId: number,
    dto: CreateLessonDto,
    _actor: AuthenticatedUser,
  ) {
    await this.findStudentOrThrow(studentId);

    return this.lessonsRepository.createLesson({
      studentId,
      name: dto.name.trim(),
      subject: dto.subject,
      weekday: dto.weekday,
    });
  }

  async updateLesson(
    studentId: number,
    lessonId: number,
    dto: UpdateLessonDto,
    _actor: AuthenticatedUser,
  ) {
    await this.findStudentOrThrow(studentId);
    await this.findLessonOrThrow(lessonId, studentId);

    const values: Partial<{
      name: string;
      subject: UpdateLessonDto['subject'];
      weekday: UpdateLessonDto['weekday'];
    }> = {};

    if (dto.name !== undefined) {
      values.name = dto.name.trim();
    }

    if (dto.subject !== undefined) {
      values.subject = dto.subject;
    }

    if (dto.weekday !== undefined) {
      values.weekday = dto.weekday;
    }

    const updated = await this.lessonsRepository.updateLessonById(
      lessonId,
      studentId,
      values,
    );

    if (!updated) {
      throw new NotFoundException('Lesson not found');
    }

    return updated;
  }

  async deleteLesson(
    studentId: number,
    lessonId: number,
    _actor: AuthenticatedUser,
  ) {
    await this.findStudentOrThrow(studentId);
    await this.findLessonOrThrow(lessonId, studentId);

    const hasHistory = await this.lessonsRepository.hasWatchHistory(
      lessonId,
      studentId,
    );

    if (hasHistory) {
      throw new BadRequestException(
        'Lesson cannot be deleted because it has watch history',
      );
    }

    await this.lessonsRepository.deleteLessonById(lessonId, studentId);

    return { ok: true as const };
  }

  async markLessonWatched(
    studentId: number,
    lessonId: number,
    _actor: AuthenticatedUser,
  ) {
    await this.findStudentOrThrow(studentId);
    const lesson = await this.findLessonOrThrow(lessonId, studentId);

    const cairoNow = this.getCairoNow();
    const watchedOn = this.formatDateAsIso(cairoNow);
    const currentWeekday = this.getLessonWeekdayFromDate(cairoNow);
    const currentWeekdayIndex = LESSON_WEEKDAY_ORDER.indexOf(currentWeekday);
    const lessonWeekdayIndex = LESSON_WEEKDAY_ORDER.indexOf(lesson.weekday);

    if (lessonWeekdayIndex === -1) {
      throw new BadRequestException('Lesson weekday is invalid');
    }

    if (lessonWeekdayIndex > currentWeekdayIndex) {
      throw new BadRequestException(
        'Lesson cannot be marked as watched before its scheduled weekday',
      );
    }

    const startOfWeek = new Date(cairoNow);
    startOfWeek.setDate(cairoNow.getDate() - currentWeekdayIndex);
    const scheduledForDateObject = new Date(startOfWeek);
    scheduledForDateObject.setDate(startOfWeek.getDate() + lessonWeekdayIndex);
    const scheduledForDate = this.formatDateAsIso(scheduledForDateObject);

    const existingWatch =
      await this.lessonsRepository.findWatchByLessonAndScheduledDate(
        lessonId,
        studentId,
        scheduledForDate,
      );

    if (existingWatch) {
      return {
        ok: true as const,
        watchedOn: existingWatch.watchedOn,
        alreadyMarked: true,
      };
    }

    const inserted = await this.lessonsRepository.markLessonWatched({
      lessonId,
      studentId,
      scheduledForDate,
      scheduledWeekday: lesson.weekday,
      watchedOn,
      watchedOnTime: lessonWeekdayIndex === currentWeekdayIndex,
    });

    return {
      ok: true as const,
      watchedOn,
      alreadyMarked: !inserted,
    };
  }

  async unmarkLessonWatched(
    studentId: number,
    lessonId: number,
    _actor: AuthenticatedUser,
  ) {
    await this.findStudentOrThrow(studentId);
    const lesson = await this.findLessonOrThrow(lessonId, studentId);

    const cairoNow = this.getCairoNow();
    const currentWeekday = this.getLessonWeekdayFromDate(cairoNow);
    const currentWeekdayIndex = LESSON_WEEKDAY_ORDER.indexOf(currentWeekday);
    const lessonWeekdayIndex = LESSON_WEEKDAY_ORDER.indexOf(lesson.weekday);

    if (lessonWeekdayIndex === -1) {
      throw new BadRequestException('Lesson weekday is invalid');
    }

    const startOfWeek = new Date(cairoNow);
    startOfWeek.setDate(cairoNow.getDate() - currentWeekdayIndex);
    const scheduledForDateObject = new Date(startOfWeek);
    scheduledForDateObject.setDate(startOfWeek.getDate() + lessonWeekdayIndex);
    const scheduledForDate = this.formatDateAsIso(scheduledForDateObject);

    const removed = await this.lessonsRepository.deleteWatchByLessonAndScheduledDate(
      lessonId,
      studentId,
      scheduledForDate,
    );

    return {
      ok: true as const,
      removed,
    };
  }

  private getCairoNow() {
    return new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
      }),
    );
  }

  private getLessonWeekdayFromDate(date: Date): LessonWeekday {
    return JS_DAY_TO_LESSON_WEEKDAY[date.getDay()];
  }

  private formatDateAsIso(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }

  private formatArabicDateLabel(date: Date) {
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Cairo',
    }).format(date);
  }

  private async findStudentOrThrow(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  private async findLessonOrThrow(lessonId: number, studentId: number) {
    const lesson = await this.lessonsRepository.findLessonByIdAndStudent(
      lessonId,
      studentId,
    );

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }
}
