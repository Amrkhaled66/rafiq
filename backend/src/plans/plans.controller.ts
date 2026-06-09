import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { UpdateStudentPlanDto } from './dto/update-student-plan.dto';

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
    console.log(studentId)
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

  @Get('students/:studentId/plans/:planId')
  @RequirePolicy('plans.read_by_student')
  getStudentPlanDetail(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    return this.plansService.getStudentPlanDetail(studentId, planId);
  }

  @Patch('students/:studentId/plans/:planId')
  @RequirePolicy('plans.update_by_student')
  updateStudentPlan(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('planId', ParseIntPipe) planId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateStudentPlanDto,
  ) {
    return this.plansService.updateStudentPlan(studentId, planId, dto, user);
  }

  @Delete('students/:studentId/plans/:planId')
  @RequirePolicy('plans.delete_by_student')
  deleteStudentPlan(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    return this.plansService.deleteStudentPlan(studentId, planId);
  }

  @Patch('students/:studentId/plans/:planId/tasks/:taskId/complete')
  @RequirePolicy('plans.complete_task_by_student')
  completePlanTask(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('planId', ParseIntPipe) planId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.plansService.completePlanTask(studentId, planId, taskId);
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

