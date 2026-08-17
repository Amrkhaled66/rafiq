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
import { ListMissedLessonsQueryDto } from './dto/list-missed-lessons-query.dto';
import { ResolveMissedLessonDto } from './dto/resolve-missed-lesson.dto';
import { MissedLessonsService } from './missed-lessons.service';

@Controller('missed-lessons')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class MissedLessonsController {
  constructor(private readonly missedLessonsService: MissedLessonsService) {}

  @Get()
  @RequirePolicy('missed_lessons.list')
  list(
    @Query() query: ListMissedLessonsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.missedLessonsService.list(query, user);
  }

  @Patch(':occurrenceId/resolve')
  @RequirePolicy('missed_lessons.resolve')
  resolve(
    @Param('occurrenceId', ParseIntPipe) occurrenceId: number,
    @Body() dto: ResolveMissedLessonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.missedLessonsService.resolve(occurrenceId, dto, user);
  }

  @Delete(':occurrenceId/resolve')
  @RequirePolicy('missed_lessons.unresolve')
  unresolve(
    @Param('occurrenceId', ParseIntPipe) occurrenceId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.missedLessonsService.unresolve(occurrenceId, user);
  }
}
