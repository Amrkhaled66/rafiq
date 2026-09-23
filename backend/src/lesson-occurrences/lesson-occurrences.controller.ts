import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import { ListLessonOccurrencesQueryDto } from './dto/list-lesson-occurrences-query.dto';
import { UpdateLessonOccurrenceDto } from './dto/update-lesson-occurrence.dto';
import { LessonOccurrencesService } from './lesson-occurrences.service';

@Controller('students/:studentId/lesson-occurrences')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class LessonOccurrencesController {
  constructor(
    private readonly lessonOccurrencesService: LessonOccurrencesService,
  ) {}

  @Get()
  @RequirePolicy('lesson_occurrences.list_by_student')
  list(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: ListLessonOccurrencesQueryDto,
  ) {
    return this.lessonOccurrencesService.listStudentOccurrencesForAdmin({
      studentId,
      from: query.from,
      to: query.to,
    });
  }

  @Post(':occurrenceId/watch')
  @RequirePolicy('lesson_occurrences.watch_by_student')
  watch(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('occurrenceId', ParseIntPipe) occurrenceId: number,
  ) {
    return this.lessonOccurrencesService.watchOccurrence(
      studentId,
      occurrenceId,
    );
  }

  @Delete(':occurrenceId/watch')
  @RequirePolicy('lesson_occurrences.unwatch_by_student')
  unwatch(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('occurrenceId', ParseIntPipe) occurrenceId: number,
  ) {
    return this.lessonOccurrencesService.unwatchOccurrence(
      studentId,
      occurrenceId,
    );
  }

  @Patch(':occurrenceId')
  @RequirePolicy('lesson_occurrences.manage_by_student')
  update(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('occurrenceId', ParseIntPipe) occurrenceId: number,
    @Body() dto: UpdateLessonOccurrenceDto,
  ) {
    return this.lessonOccurrencesService.updateOccurrenceDate(
      studentId,
      occurrenceId,
      dto.scheduledForDate,
    );
  }

  @Delete(':occurrenceId')
  @RequirePolicy('lesson_occurrences.manage_by_student')
  delete(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('occurrenceId', ParseIntPipe) occurrenceId: number,
  ) {
    return this.lessonOccurrencesService.deleteOccurrence(
      studentId,
      occurrenceId,
    );
  }
}
