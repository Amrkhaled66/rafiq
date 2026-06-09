import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentsRepository } from '../students/students.repository';
import { TasksRepository } from './tasks.repository';

type MobileTaskStatus = 'completed' | 'in_progress' | 'not_started';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async getTodayTasks(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const cairoNow = this.getCairoNow();
    const today = this.formatDateAsIso(cairoNow);
    const tasks = await this.tasksRepository.listTodayTasksByStudent(studentId, today);

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
          totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
        completedCount,
        totalCount,
      },
      statusCounts,
      tasks,
    };
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

  private getCairoNow() {
    return new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
      }),
    );
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
