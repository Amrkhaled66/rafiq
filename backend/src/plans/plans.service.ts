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
import { UpdateStudentPlanDto } from './dto/update-student-plan.dto';

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
    await this.findStudentOrThrow(studentId);
    const coachId = await this.resolveCoachId(studentId, dto.coachId, user);
    const tasks = await this.validateAndNormalizePlanInput(studentId, dto);

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

  async getStudentPlanDetail(studentId: number, planId: number) {
    await this.findStudentOrThrow(studentId);
    const plan = await this.findPlanOrThrow(studentId, planId);
    const taskRows = await this.plansRepository.listPlanTasks(planId);

    const groupedDays = new Map<
      string,
      {
        date: string;
        weekday: string;
        tasks: Array<{
          id: number;
          title: string;
          subject: string;
          status: string;
        }>;
      }
    >();

    let completedTasks = 0;
    let missedTasks = 0;
    let pendingTasks = 0;

    for (const task of taskRows) {
      if (task.status === 'done') {
        completedTasks += 1;
      } else if (task.status === 'missed') {
        missedTasks += 1;
      } else {
        pendingTasks += 1;
      }

      const existing = groupedDays.get(task.dueAt) ?? {
        date: task.dueAt,
        weekday: this.getArabicWeekday(task.dueAt),
        tasks: [],
      };

      existing.tasks.push({
        id: task.id,
        title: task.title,
        subject: task.subject,
        status: task.status,
      });

      groupedDays.set(task.dueAt, existing);
    }

    const totalTasks = taskRows.length;
    const progressPercent =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const days = Array.from(groupedDays.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((day) => {
        const dayCompleted = day.tasks.filter((task) => task.status === 'done').length;
        const dayProgressPercent =
          day.tasks.length > 0
            ? Math.round((dayCompleted / day.tasks.length) * 100)
            : 0;

        return {
          ...day,
          progressPercent: dayProgressPercent,
        };
      });

    return {
      plan: {
        id: plan.id,
        name: plan.name,
        startsOn: plan.startsOn,
        endsOn: plan.endsOn,
        createdAt: plan.createdAt,
        coachId: plan.coachId,
      },
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        missedTasks,
        progressPercent,
      },
      days,
    };
  }

  async deleteStudentPlan(studentId: number, planId: number) {
    await this.findStudentOrThrow(studentId);
    await this.findPlanOrThrow(studentId, planId);

    await this.plansRepository.deletePlanById(planId, studentId);

    return { ok: true as const };
  }

  async completePlanTask(studentId: number, planId: number, taskId: number) {
    await this.findStudentOrThrow(studentId);
    await this.findPlanOrThrow(studentId, planId);

    const task = await this.plansRepository.markTaskDone(taskId, planId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateStudentPlan(
    studentId: number,
    planId: number,
    dto: UpdateStudentPlanDto,
    user: AuthenticatedUser,
  ) {
    await this.findStudentOrThrow(studentId);
    await this.findPlanOrThrow(studentId, planId);

    const coachId = await this.resolveCoachId(studentId, dto.coachId, user);
    const tasks = await this.validateAndNormalizePlanInput(studentId, dto, planId);

    const updated = await this.plansRepository.updateStudentPlan({
      planId,
      studentId,
      coachId,
      name: dto.name.trim(),
      startsOn: dto.startsOn,
      endsOn: dto.endsOn,
      tasks,
    });

    return { id: updated.id };
  }

  async getCoachPlans(coachId: number, query: ListCoachPlansQueryDto) {
    const coach = await this.coachesRepository.findById(coachId);

    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return this.plansRepository.listCoachPlans(coachId, query);
  }

  private async findStudentOrThrow(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  private async findPlanOrThrow(studentId: number, planId: number) {
    const plan = await this.plansRepository.findPlanByIdAndStudent(planId, studentId);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  private async resolveCoachId(
    studentId: number,
    requestedCoachId: number | undefined,
    user: AuthenticatedUser,
  ) {
    if (user.role === 'coach') {
      return user.sub;
    }

    if (!requestedCoachId) {
      throw new BadRequestException('coachId is required');
    }

    const assigned = await this.studentsRepository.isCoachAssignedToStudent(
      studentId,
      requestedCoachId,
    );

    if (!assigned) {
      throw new BadRequestException('Coach is not assigned to this student');
    }

    return requestedCoachId;
  }

  private async validateAndNormalizePlanInput(
    studentId: number,
    dto: CreateStudentPlanDto | UpdateStudentPlanDto,
    excludePlanId?: number,
  ) {
    if (dto.endsOn < dto.startsOn) {
      throw new BadRequestException('endsOn must be >= startsOn');
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

    await this.assertNoOverlap(studentId, dto.startsOn, dto.endsOn, excludePlanId);

    return tasks;
  }

  private async assertNoOverlap(
    studentId: number,
    startsOn: string,
    endsOn: string,
    excludePlanId?: number,
  ) {
    const hasOverlap = await this.plansRepository.hasOverlappingPlan({
      studentId,
      startsOn,
      endsOn,
      excludePlanId,
    });

    if (hasOverlap) {
      throw new BadRequestException(
        'Plan dates overlap with an existing plan for this student',
      );
    }
  }

  private getArabicWeekday(date: string) {
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      timeZone: 'Africa/Cairo',
    }).format(new Date(date));
  }
}
