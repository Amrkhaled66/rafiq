import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import { TasksService } from './tasks.service';

@Controller()
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('students/:studentId/tasks/today')
  @RequirePolicy('tasks.list_today_by_student')
  getStudentTodayTasks(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.tasksService.getTodayTasks(studentId);
  }

  @Get('students/:studentId/tasks/:taskId')
  @RequirePolicy('tasks.read_by_student')
  getStudentTaskDetail(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.tasksService.getStudentTaskDetail(studentId, taskId);
  }

  @Get('students/:studentId/tasks/:taskId/sessions')
  @RequirePolicy('tasks.sessions.list_by_student')
  getStudentTaskSessions(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.tasksService.getStudentTaskSessions(studentId, taskId);
  }

  @Patch('students/:studentId/tasks/:taskId/complete')
  @RequirePolicy('tasks.complete_by_student')
  completeStudentTask(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.tasksService.completeStudentTask(studentId, taskId);
  }

  @Post('students/:studentId/tasks/:taskId/sessions')
  @RequirePolicy('tasks.sessions.start_by_student')
  startStudentTaskSession(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.tasksService.startStudentTaskSession(studentId, taskId);
  }
}
