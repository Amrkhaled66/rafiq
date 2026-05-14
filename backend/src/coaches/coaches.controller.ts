import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import { ListCoachPlansQueryDto } from './dto/list-coach-plans-query.dto';
import { CoachesService } from './coaches.service';
import { ListCoachesQueryDto } from './dto/list-coaches-query.dto';

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

  @Get(':id/plans')
  @RequirePolicy('coaches.read')
  listCoachPlans(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListCoachPlansQueryDto,
  ) {
    return this.coachesService.listCoachPlans(id, query);
  }
}
