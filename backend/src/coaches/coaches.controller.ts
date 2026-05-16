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
import { CoachesService } from './coaches.service';
import { ListCoachesQueryDto } from './dto/list-coaches-query.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Controller('coaches')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  @RequirePolicy('coaches.list')
  listCoaches(@Query() query: ListCoachesQueryDto) {
    return this.coachesService.listCoaches(query);
  }

  @Get(':id')
  @RequirePolicy('coaches.read')
  getCoachById(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.getCoachById(id);
  }

  @Get(':id/overview')
  @RequirePolicy('coaches.read')
  getCoachOverview(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.getCoachOverview(id);
  }

  @Patch(':id')
  @RequirePolicy('coaches.update')
  updateCoach(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateCoachDto,
  ) {
    return this.coachesService.updateCoach(id, dto, user);
  }
}
