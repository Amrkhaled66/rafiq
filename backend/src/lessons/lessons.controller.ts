import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller()
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('students/:studentId/lessons')
  @RequirePolicy('lessons.list_by_student')
  listLessons(
    @Param('studentId', ParseIntPipe) studentId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.lessonsService.listLessons(studentId, user);
  }

  @Get('students/:studentId/lessons/today')
  @RequirePolicy('lessons.today_by_student')
  getTodayLessons(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.lessonsService.getTodayLessons(studentId);
  }

  @Post('students/:studentId/lessons')
  @RequirePolicy('lessons.create_by_student')
  createLesson(
    @Param('studentId', ParseIntPipe) studentId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.createLesson(studentId, dto, user);
  }

  @Patch('students/:studentId/lessons/:lessonId')
  @RequirePolicy('lessons.update_by_student')
  updateLesson(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(studentId, lessonId, dto, user);
  }

  @Delete('students/:studentId/lessons/:lessonId')
  @RequirePolicy('lessons.delete_by_student')
  deleteLesson(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.lessonsService.deleteLesson(studentId, lessonId, user);
  }

  @Post('students/:studentId/lessons/:lessonId/watch')
  @RequirePolicy('lessons.watch_by_student')
  markLessonWatched(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.lessonsService.markLessonWatched(studentId, lessonId, user);
  }

  @Delete('students/:studentId/lessons/:lessonId/watch')
  @RequirePolicy('lessons.unwatch_by_student')
  unmarkLessonWatched(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.lessonsService.unmarkLessonWatched(studentId, lessonId, user);
  }
}
