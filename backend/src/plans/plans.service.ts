import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentPlanDto } from './dto/create-student-plan.dto';
import { ListCoachPlansQueryDto } from './dto/list-coach-plans-query.dto';
import { PlansRepository } from './plans.repository';
import { ListStudentPlansQueryDto } from './dto/list-student-plans-query.dto';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { StudentsRepository } from '../students/students.repository';
import { CoachesRepository } from '../coaches/coaches.repository';

@Injectable()
export class PlansService {
  constructor(
    private readonly plansRepository: PlansRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly coachesRepository: CoachesRepository,
  ) {}

  async getStudentPlans(studentId: number, query: ListStudentPlansQueryDto) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const stats = await this.plansRepository.getStudentPlansStats(studentId);
    const list = await this.plansRepository.listStudentPlans(studentId, query);

    return {
      student,
      stats,
      items: list.items.map((plan) => ({
        ...plan,
        progressPercent:
          plan.totalTasks > 0
            ? Math.round((plan.completedTasks / plan.totalTasks) * 100)
            : 0,
      })),
      page: list.page,
      limit: list.limit,
      total: list.total,
    };
  }

  async createStudentPlan(
    studentId: number,
    dto: CreateStudentPlanDto,
    user: AuthenticatedUser,
  ) {
    const student = await this.studentsRepository.findByUserId(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    let coachId: number;

    if (user.role === 'coach') {
      coachId = user.sub;
    } else {
      if (!dto.coachId) {
        throw new BadRequestException('coachId is required');
      }

      const assigned = await this.studentsRepository.isCoachAssignedToStudent(
        studentId,
        dto.coachId,
      );

      if (!assigned) {
        throw new BadRequestException('Coach is not assigned to this student');
      }

      coachId = dto.coachId;
    }

    // Runtime validation beyond DTO.
    if (dto.endsOn < dto.startsOn) {
      throw new BadRequestException('endsOn must be >= startsOn');
    }

    const hasOverlap = await this.plansRepository.hasOverlappingPlan({
      studentId,
      startsOn: dto.startsOn,
      endsOn: dto.endsOn,
    });

    if (hasOverlap) {
      throw new BadRequestException(
        'Plan dates overlap with an existing plan for this student',
      );
    }

    const tasks = dto.tasks.map((t) => ({
      title: t.title.trim(),
      subject: t.subject,
      dueOn: t.dueOn,
    }));

    if (tasks.length === 0) {
      throw new BadRequestException('At least one task is required');
    }

    if (tasks.some((t) => !t.title)) {
      throw new BadRequestException('Task title is required');
    }

    for (const t of tasks) {
      if (t.dueOn < dto.startsOn || t.dueOn > dto.endsOn) {
        throw new BadRequestException('Task dueOn must be within plan range');
      }
    }

    const created = await this.plansRepository.createStudentPlan({
      studentId,
      coachId,
      name: dto.name.trim(),
      startsOn: dto.startsOn,
      endsOn: dto.endsOn,
      tasks,
    });

    return { id: created.id };
  }

  async getCoachPlans(coachId: number, query: ListCoachPlansQueryDto) {
    const coach = await this.coachesRepository.findById(coachId);

    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return this.plansRepository.listCoachPlans(coachId, query);
  }
}
