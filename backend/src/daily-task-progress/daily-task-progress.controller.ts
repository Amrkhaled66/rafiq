import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { DailyTaskProgressService } from './daily-task-progress.service';
import { ListDailyTaskProgressQueryDto } from './dto/list-daily-task-progress-query.dto';

@Controller('daily-task-progress')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class DailyTaskProgressController {
  constructor(private readonly service: DailyTaskProgressService) {}

  @Get()
  @RequirePolicy('daily_task_progress.list')
  list(
    @Query() query: ListDailyTaskProgressQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.list(query, user);
  }
}
