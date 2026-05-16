import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { ListMissedTasksQueryDto } from './dto/list-missed-tasks-query.dto';
import { ResolveMissedTaskDto } from './dto/resolve-missed-task.dto';
import { MissedTasksService } from './missed-tasks.service';

@Controller('missed-tasks')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class MissedTasksController {
  constructor(private readonly missedTasksService: MissedTasksService) {}

  @Get()
  @RequirePolicy('missed_tasks.list')
  listMissedTasks(
    @Query() query: ListMissedTasksQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.missedTasksService.listMissedTasks(query, user);
  }

  @Patch(':taskId/resolve')
  @RequirePolicy('missed_tasks.resolve')
  resolveTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: ResolveMissedTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.missedTasksService.resolveTask(taskId, dto, user);
  }

  @Delete(':taskId/resolve')
  @RequirePolicy('missed_tasks.unresolve')
  unresolveTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.missedTasksService.unresolveTask(taskId);
  }
}
