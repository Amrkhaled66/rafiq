import { BadRequestException, Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { ListMissedTasksQueryDto } from './dto/list-missed-tasks-query.dto';
import { ResolveMissedTaskDto } from './dto/resolve-missed-task.dto';
import { MissedTasksRepository } from './missed-tasks.repository';

@Injectable()
export class MissedTasksService {
  constructor(private readonly missedTasksRepository: MissedTasksRepository) {}

  async listMissedTasks(
    query: ListMissedTasksQueryDto,
    user: AuthenticatedUser,
  ) {
    if (query.from && query.to && query.to < query.from) {
      throw new BadRequestException('to must be >= from');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [stats, list] = await Promise.all([
      this.missedTasksRepository.getMissedTasksStats({
        role: user.role as 'coach' | 'super_admin',
        userId: user.sub,
      }),
      this.missedTasksRepository.listMissedTasks({
        role: user.role as 'coach' | 'super_admin',
        userId: user.sub,
        page,
        limit,
        from: query.from,
        to: query.to,
        status: query.status,
        coachId: query.coachId,
      }),
    ]);

    return {
      stats,
      items: list.items,
      page: list.page,
      limit: list.limit,
      total: list.total,
    };
  }

  async resolveTask(
    taskId: number,
    dto: ResolveMissedTaskDto,
    user: AuthenticatedUser,
  ) {
    await this.missedTasksRepository.resolveTask(taskId, user.sub, dto.note.trim());
    return { ok: true as const };
  }

  async unresolveTask(taskId: number) {
    await this.missedTasksRepository.unresolveTask(taskId);
    return { ok: true as const };
  }
}
