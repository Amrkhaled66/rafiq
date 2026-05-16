import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateStudentPlanDto } from './dto/create-student-plan.dto';
import { ListCoachPlansQueryDto } from './dto/list-coach-plans-query.dto';
import { ListStudentPlansQueryDto } from './dto/list-student-plans-query.dto';
import { PlansService } from './plans.service';

@Controller()
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get('students/:studentId/plans')
  @RequirePolicy('plans.list_by_student')
  getStudentPlans(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: ListStudentPlansQueryDto,
  ) {
    return this.plansService.getStudentPlans(studentId, query);
  }

  @Post('students/:studentId/plans')
  @RequirePolicy('plans.create_by_student')
  createStudentPlan(
    @Param('studentId', ParseIntPipe) studentId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateStudentPlanDto,
  ) {
    return this.plansService.createStudentPlan(studentId, dto, user);
  }

  @Get('coaches/:id/plans')
  @RequirePolicy('coaches.read')
  getCoachPlans(
    @Param('id', ParseIntPipe) coachId: number,
    @Query() query: ListCoachPlansQueryDto,
  ) {
    return this.plansService.getCoachPlans(coachId, query);
  }
}

