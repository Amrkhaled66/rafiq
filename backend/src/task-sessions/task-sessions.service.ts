import { BadRequestException, Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { ListTaskSessionsQueryDto } from './dto/list-task-sessions-query.dto';
import { TaskSessionsRepository } from './task-sessions.repository';

@Injectable()
export class TaskSessionsService {
  constructor(
    private readonly taskSessionsRepository: TaskSessionsRepository,
  ) {}

  async listTaskSessions(
    query: ListTaskSessionsQueryDto,
    user: AuthenticatedUser,
  ) {
    if (query.from && query.to && query.to < query.from) {
      throw new BadRequestException('to must be >= from');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filters = {
      role: user.role as 'coach' | 'super_admin',
      userId: user.sub,
      studentPhone: query.studentPhone,
      status: query.status,
      from: query.from,
      to: query.to,
    };

    const [stats, list] = await Promise.all([
      this.taskSessionsRepository.getTaskSessionStats(filters),
      this.taskSessionsRepository.listTaskSessions({
        ...filters,
        page,
        limit,
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
}
