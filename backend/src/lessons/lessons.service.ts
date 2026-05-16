import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { StudentsRepository } from '../students/students.repository';
import { LessonsRepository } from './lessons.repository';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

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
      scheduledAt: dto.scheduledAt,
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
      scheduledAt: string;
    }> = {};

    if (dto.name !== undefined) {
      values.name = dto.name.trim();
    }

    if (dto.subject !== undefined) {
      values.subject = dto.subject;
    }

    if (dto.scheduledAt !== undefined) {
      values.scheduledAt = dto.scheduledAt;
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

    const watchedOn = this.getTodayDateInCairo();

    if (watchedOn < lesson.scheduledAt) {
      throw new BadRequestException(
        'Lesson cannot be marked as watched before its scheduled date',
      );
    }

    const existingWatch =
      await this.lessonsRepository.findWatchByLessonAndStudent(
        lessonId,
        studentId,
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
      scheduledOn: lesson.scheduledAt,
      watchedOn,
    });

    return {
      ok: true as const,
      watchedOn,
      alreadyMarked: !inserted,
    };
  }

  private getTodayDateInCairo(): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
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
