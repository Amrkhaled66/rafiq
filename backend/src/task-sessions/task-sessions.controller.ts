import {
  Body,
  Controller,
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
import { ListTaskSessionsQueryDto } from './dto/list-task-sessions-query.dto';
import { ResumeTaskSessionDto } from './dto/resume-task-session.dto';
import { TaskSessionActionDto } from './dto/task-session-action.dto';
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

  @Patch(':sessionId/pause')
  @RequirePolicy('task_sessions.pause')
  pauseTaskSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() body: TaskSessionActionDto,
  ) {
    return this.taskSessionsService.pauseTaskSession(
      sessionId,
      body.elapsedSeconds,
    );
  }

  @Patch(':sessionId/resume')
  @RequirePolicy('task_sessions.resume')
  resumeTaskSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() body: ResumeTaskSessionDto,
  ) {
    return this.taskSessionsService.resumeTaskSession(
      sessionId,
      body.expectedEndAt,
    );
  }

  @Patch(':sessionId/cancel')
  @RequirePolicy('task_sessions.cancel')
  cancelTaskSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.taskSessionsService.cancelTaskSession(sessionId);
  }

  @Patch(':sessionId/complete')
  @RequirePolicy('task_sessions.complete')
  completeTaskSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.taskSessionsService.completeTaskSession(sessionId);
  }
}
