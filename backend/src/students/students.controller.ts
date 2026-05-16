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
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateStudentCoachAssignmentDto } from './dto/create-student-coach-assignment.dto';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @RequirePolicy('students.list')
  listStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListStudentsQueryDto,
  ) {
    return this.studentsService.listStudents(user, query);
  }

  @Get(':id/overview')
  @RequirePolicy('students.read')
  getStudentOverview(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentOverview(id);
  }

  @Get(':id/coaches')
  @RequirePolicy('students.coaches.list')
  listAssignedCoaches(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.listAssignedCoaches(id);
  }

  @Post(':id/coach-assignments')
  @RequirePolicy('students.coaches.assign')
  assignCoachToStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStudentCoachAssignmentDto,
  ) {
    return this.studentsService.assignCoachToStudent(id, dto.coachId);
  }

  @Delete(':id/coach-assignments/:coachId')
  @RequirePolicy('students.coaches.remove')
  removeCoachFromStudent(
    @Param('id', ParseIntPipe) id: number,
    @Param('coachId', ParseIntPipe) coachId: number,
  ) {
    return this.studentsService.removeCoachFromStudent(id, coachId);
  }

  @Post()
  @RequirePolicy('students.create')
  createStudent(@Body() dto: CreateStudentDto) {
    return this.studentsService.createStudent(dto);
  }

  @Patch(':id')
  @RequirePolicy('students.update')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(id, dto, user);
  }
}
