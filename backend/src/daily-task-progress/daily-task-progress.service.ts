import { BadRequestException, Injectable } from '@nestjs/common';
import { getCairoDateString } from '../common/dates/cairo-date';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { TasksService } from '../tasks/tasks.service';
import { DailyTaskProgressRepository } from './daily-task-progress.repository';
import type { ListDailyTaskProgressQueryDto } from './dto/list-daily-task-progress-query.dto';

@Injectable()
export class DailyTaskProgressService {
  constructor(
    private readonly repository: DailyTaskProgressRepository,
    private readonly tasksService: TasksService,
  ) {}

  async list(query: ListDailyTaskProgressQueryDto, user: AuthenticatedUser) {
    const today = getCairoDateString();
    const parsedDate = new Date(`${query.date}T12:00:00.000Z`);
    const isValidDate =
      Number.isFinite(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === query.date;
    if (!isValidDate || query.date > today) {
      throw new BadRequestException('date must be today or earlier');
    }
    if (query.date === today && query.status !== 'finished') {
      throw new BadRequestException(
        'only finished status is available for today',
      );
    }

    await this.tasksService.synchronizeMissedTasks();

    return this.repository.list({
      role: user.role as 'coach' | 'super_admin',
      userId: user.sub,
      date: query.date,
      status: query.status,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
}
