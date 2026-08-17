import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import { LessonOccurrencesService } from './lesson-occurrences.service';

@Controller('students/:studentId/lesson-occurrences')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class LessonOccurrencesController {
  constructor(
    private readonly lessonOccurrencesService: LessonOccurrencesService,
  ) {}

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
}
