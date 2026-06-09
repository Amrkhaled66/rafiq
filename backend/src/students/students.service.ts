import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { TasksRepository } from '../tasks/tasks.repository';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  AssignedCoachRow,
  StudentAggregate,
  StudentsRepository,
} from './students.repository';

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
  dueAt: string;
  planId: number;
}

export interface StudentOverviewLesson {
  id: number;
  subject: string;
  scheduledAt: string;
}

export interface StudentOverview {
  student: StudentAggregate;
  assignedCoaches: AssignedCoachRow[];
  stats: StudentOverviewStats;
  todayTasks: StudentOverviewTask[];
  todayLessons: StudentOverviewLesson[];
}

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService,
  ) {}

  async getStudentOverview(id: number): Promise<StudentOverview> {
    const student = await this.findStudentByIdOrThrow(id);
    const assignedCoaches = await this.studentsRepository.listAssignedCoaches(id);
    const today = this.formatDateAsIso(
      new Date(
        new Date().toLocaleString('en-US', {
          timeZone: 'Africa/Cairo',
        }),
      ),
    );
    const todayTasks = await this.tasksRepository.listTodayTasksByStudent(id, today);

    return {
      student,
      assignedCoaches,
      stats: {
        totalTasks: todayTasks.length,
        completedTasks: 0,
        remainingTasks: 0,
        missedTasks: 0,
        completionRate: 0,
      },
      todayTasks: todayTasks.map((t) => ({
        id: t.id,
        title: t.title,
        subject: t.subject,
        status: t.status,
        dueAt: t.dueAt,
        planId: t.planId,
      })),
      todayLessons: [],
    };
  }

  async listAssignedCoaches(studentId: number) {
    await this.findStudentByIdOrThrow(studentId);
    return this.studentsRepository.listAssignedCoaches(studentId);
  }

  async assignCoachToStudent(studentId: number, coachId: number) {
    await this.findStudentByIdOrThrow(studentId);

    const coachRole = await this.studentsRepository.findUserRoleById(coachId);
    if (coachRole !== 'coach') {
      // Keep message intentionally generic to avoid role leakage.
      throw new NotFoundException('Coach not found');
    }

    await this.studentsRepository.assignCoachToStudent(studentId, coachId);
    return { ok: true };
  }

  async removeCoachFromStudent(studentId: number, coachId: number) {
    await this.findStudentByIdOrThrow(studentId);
    await this.studentsRepository.removeCoachFromStudent(studentId, coachId);
    return { ok: true };
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

    const userUpdate: Partial<Pick<UpdateStudentDto, 'fullName' | 'phone' | 'password'>> =
      {};

    if (dto.fullName !== undefined) {
      userUpdate.fullName = dto.fullName;
    }

    if (dto.phone !== undefined) {
      userUpdate.phone = dto.phone;
    }

    if (dto.password !== undefined) {
      userUpdate.password = dto.password;
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

  private formatDateAsIso(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }
}
