import {
  Body,
  Controller,
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
