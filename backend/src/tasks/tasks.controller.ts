import {
  Controller,
  Get,
  Param,
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
}
