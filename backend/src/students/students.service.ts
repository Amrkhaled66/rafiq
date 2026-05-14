import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentAggregate, StudentsRepository } from './students.repository';

export interface StudentOverviewStats {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  missedTasks: number;
  completionRate: number;
}

export interface StudentOverviewTask {
  id: number;
  title: string;
  subject: string;
  status: string;
  sessionsCount: number;
}

export interface StudentOverviewLesson {
  id: number;
  subject: string;
  scheduledAt: string;
}

export interface StudentOverview {
  student: StudentAggregate;
  stats: StudentOverviewStats;
  todayTasks: StudentOverviewTask[];
  todayLessons: StudentOverviewLesson[];
}

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly usersService: UsersService,
  ) {}

  async getStudentOverview(id: number): Promise<StudentOverview> {
    const student = await this.findStudentByIdOrThrow(id);

    return {
      student,
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        remainingTasks: 0,
        missedTasks: 0,
        completionRate: 0,
      },
      todayTasks: [],
      todayLessons: [],
    };
  }

  async listStudents(actor: AuthenticatedUser, query: ListStudentsQueryDto) {
    const effectiveCoachId = actor.role === 'coach' ? actor.sub : query.coachId;

    return this.studentsRepository.listStudents(query.page, query.limit, {
      coachId: effectiveCoachId,
      gradeLevel: query.gradeLevel,
      city: query.city,
      search: query.search,
      deletedStatus: query.deletedStatus,
    });
  }

  async createStudent(dto: CreateStudentDto): Promise<StudentAggregate> {
    const createdUser = await this.usersService.createUser({
      fullName: dto.fullName,
      phone: dto.phone,
      password: dto.password,
      role: 'student',
    } satisfies CreateUserDto);

    await this.studentsRepository.createProfile({
      userId: createdUser.id,
      city: dto.city,
      parentPhone: dto.parentPhone.trim(),
      gradeLevel: dto.gradeLevel,
    });

    return this.findStudentByIdOrThrow(createdUser.id);
  }

  async updateStudent(
    id: number,
    dto: UpdateStudentDto,
    actor: AuthenticatedUser,
  ): Promise<StudentAggregate> {
    await this.findStudentByIdOrThrow(id);

    const userUpdate: Partial<Pick<UpdateStudentDto, 'fullName' | 'phone'>> =
      {};

    if (dto.fullName !== undefined) {
      userUpdate.fullName = dto.fullName;
    }

    if (dto.phone !== undefined) {
      userUpdate.phone = dto.phone;
    }

    if (Object.keys(userUpdate).length > 0) {
      await this.usersService.updateUser(id, userUpdate, actor);
    }

    const profileUpdate: Partial<{
      city: UpdateStudentDto['city'];
      parentPhone: string;
      gradeLevel: UpdateStudentDto['gradeLevel'];
      updatedAt: Date;
    }> = {};

    if (dto.city !== undefined) {
      profileUpdate.city = dto.city;
    }

    if (dto.parentPhone !== undefined) {
      profileUpdate.parentPhone = dto.parentPhone.trim();
    }

    if (dto.gradeLevel !== undefined) {
      profileUpdate.gradeLevel = dto.gradeLevel;
    }

    if (Object.keys(profileUpdate).length > 0) {
      profileUpdate.updatedAt = new Date();
      await this.studentsRepository.updateProfileByUserId(id, profileUpdate);
    }

    return this.findStudentByIdOrThrow(id);
  }

  private async findStudentByIdOrThrow(id: number): Promise<StudentAggregate> {
    const student = await this.studentsRepository.findByUserId(id);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
