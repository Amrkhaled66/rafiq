import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { ListMissedLessonsQueryDto } from './dto/list-missed-lessons-query.dto';
import { ResolveMissedLessonDto } from './dto/resolve-missed-lesson.dto';
import { MissedLessonsRepository } from './missed-lessons.repository';

@Injectable()
export class MissedLessonsService {
  constructor(
    private readonly missedLessonsRepository: MissedLessonsRepository,
  ) {}

  async list(query: ListMissedLessonsQueryDto, user: AuthenticatedUser) {
    if (query.from && query.to && query.to < query.from) {
      throw new BadRequestException('to must be >= from');
    }

    const scope = {
      role: user.role as 'coach' | 'super_admin',
      userId: user.sub,
      coachId: query.coachId,
    };
    const [stats, list] = await Promise.all([
      this.missedLessonsRepository.getStats(scope),
      this.missedLessonsRepository.listMissedLessons({
        ...scope,
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        from: query.from,
        to: query.to,
        status: query.status,
        watchStatus: query.watchStatus,
        studentPhone: query.studentPhone,
      }),
    ]);

    return { stats, ...list };
  }

  async resolve(
    occurrenceId: number,
    dto: ResolveMissedLessonDto,
    user: AuthenticatedUser,
  ) {
    await this.assertAccess(occurrenceId, user);
    await this.missedLessonsRepository.resolve(
      occurrenceId,
      user.sub,
      dto.note.trim(),
    );
    return { ok: true as const };
  }

  async unresolve(occurrenceId: number, user: AuthenticatedUser) {
    await this.assertAccess(occurrenceId, user);
    await this.missedLessonsRepository.unresolve(occurrenceId);
    return { ok: true as const };
  }

  private async assertAccess(occurrenceId: number, user: AuthenticatedUser) {
    const occurrence =
      await this.missedLessonsRepository.findMissedOccurrence(occurrenceId);

    if (!occurrence) {
      throw new NotFoundException('Missed lesson not found');
    }

    if (
      user.role === 'coach' &&
      !(await this.missedLessonsRepository.isCoachAssigned(
        occurrence.studentId,
        user.sub,
      ))
    ) {
      throw new ForbiddenException('Coach is not assigned to this student');
    }
  }
}
