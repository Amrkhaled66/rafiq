import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StudentsRepository } from '../students/students.repository';
import { TaskSessionsService } from '../task-sessions/task-sessions.service';
import { TASK_FOCUS_DURATION_MINUTES } from './task-focus-duration';
import { TasksRepository } from './tasks.repository';

type MobileTaskStatus = 'completed' | 'in_progress' | 'not_started';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly taskSessionsService: TaskSessionsService,
  ) {}

  async getTodayTasks(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const cairoNow = this.getCairoNow();
    const today = this.formatDateAsIso(cairoNow);
    const tasks = await this.tasksRepository.listTodayTasksByStudent(
      studentId,
      today,
    );

    const statusCounts: Record<MobileTaskStatus, number> = {
      completed: 0,
      in_progress: 0,
      not_started: 0,
    };

    for (const task of tasks) {
      statusCounts[this.toMobileTaskStatus(task.status)] += 1;
    }

    const completedCount = statusCounts.completed;
    const totalCount = tasks.length;

    return {
      dateLabel: this.formatArabicDateLabel(cairoNow),
      progress: {
        percentage:
          totalCount === 0
            ? 0
            : Math.round((completedCount / totalCount) * 100),
        completedCount,
        totalCount,
      },
      statusCounts,
      tasks,
    };
  }

  async getStudentTaskDetail(studentId: number, taskId: number) {
    await this.findStudentOrThrow(studentId);
    const task = await this.findTaskOrThrow(studentId, taskId);
    const snapshot = await this.taskSessionsService.getTaskSessionsSnapshot(
      studentId,
      taskId,
    );

    return {
      serverNow: new Date(),
      id: task.id,
      title: task.title,
      subject: task.subject,
      status: this.toMobileTaskStatus(task.status),
      focusDurationMinutes: TASK_FOCUS_DURATION_MINUTES,
      stats: snapshot.stats,
      activeSession: snapshot.activeSession,
      sessions: snapshot.sessions,
    };
  }

  async getStudentTaskSessions(studentId: number, taskId: number) {
    await this.findStudentOrThrow(studentId);
    await this.findTaskOrThrow(studentId, taskId);

    return this.taskSessionsService.listTaskSessionsByTask(studentId, taskId);
  }

  async startStudentTaskSession(studentId: number, taskId: number) {
    await this.findStudentOrThrow(studentId);
    const task = await this.findTaskOrThrow(studentId, taskId);

    if (task.status === 'done') {
      throw new ConflictException('Completed tasks cannot start new sessions');
    }

    return this.taskSessionsService.startTaskSession(studentId, taskId);
  }

  async completeStudentTask(studentId: number, taskId: number) {
    await this.findStudentOrThrow(studentId);
    const task = await this.findTaskOrThrow(studentId, taskId);

    if (task.status === 'done' && task.completedAt) {
      return {
        id: task.id,
        status: 'completed' as const,
        completedAt: task.completedAt,
      };
    }

    const snapshot = await this.taskSessionsService.getTaskSessionsSnapshot(
      studentId,
      taskId,
    );

    if (snapshot.activeSession) {
      throw new ConflictException({
        message: 'Task cannot be completed while it has an active session',
        activeSession: snapshot.activeSession,
      });
    }

    const completed = await this.tasksRepository.markTaskDone(taskId);

    if (!completed) {
      throw new NotFoundException('Task not found');
    }

    return {
      id: completed.id,
      status: 'completed' as const,
      completedAt: completed.completedAt,
    };
  }

  @Cron('5 * * * *', { timeZone: 'Africa/Cairo' })
  synchronizeMissedTasks(now = new Date()) {
        console.log("markOverdueTasksMissed")
    return this.tasksRepository.markOverdueTasksMissed(
      this.formatDateAsIso(now, 'Africa/Cairo'),
    );
  }

  private toMobileTaskStatus(
    status: 'pending' | 'in_progress' | 'done' | 'missed',
  ): MobileTaskStatus {
    switch (status) {
      case 'done':
        return 'completed';
      case 'in_progress':
        return 'in_progress';
      default:
        return 'not_started';
    }
  }

  private async findStudentOrThrow(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  private async findTaskOrThrow(studentId: number, taskId: number) {
    const task = await this.tasksRepository.findTaskByStudent(
      studentId,
      taskId,
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  private getCairoNow() {
    return new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
      }),
    );
  }

  private formatDateAsIso(date: Date, timeZone?: string): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone,
    }).formatToParts(date);

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }

  private formatArabicDateLabel(date: Date) {
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Cairo',
    }).format(date);
  }
}
