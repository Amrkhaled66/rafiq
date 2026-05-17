import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { ListTaskSessionsQueryDto } from './dto/list-task-sessions-query.dto';
import { TaskSessionsService } from './task-sessions.service';

@Controller('task-sessions')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class TaskSessionsController {
  constructor(private readonly taskSessionsService: TaskSessionsService) {}

  @Get()
  @RequirePolicy('task_sessions.list')
  listTaskSessions(
    @Query() query: ListTaskSessionsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.taskSessionsService.listTaskSessions(query, user);
  }
}
