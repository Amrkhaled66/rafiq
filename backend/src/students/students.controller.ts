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
import { Authorize } from '../authorization/decorators/authorize.decorator';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateStudentDto } from './dto/create-student.dto';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

const resource = 'student_profile';

@Controller('students')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.getMe(user);
  }

  @Get()
  @Authorize({
    action: 'read',
    resource: 'user',
  })
  listStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListStudentsQueryDto,
  ) {
    return this.studentsService.listStudents(user, query);
  }

  @Get(':id')
  @Authorize({
    action: 'read',
    resource,
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
  })
  getStudentById(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentById(id);
  }

  @Post()
  @Authorize({
    action: 'create',
    resource,
  })
  createStudent(@Body() dto: CreateStudentDto) {
    return this.studentsService.createStudent(dto);
  }

  @Patch(':id')
  @Authorize({
    action: 'update',
    resource,
    lookup: { key: 'id', kind: 'resourceId', source: 'params' },
  })
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(id, dto, user);
  }
}
