import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsRepository } from '../lessons/lessons.repository';
import { StudentsRepository } from '../students/students.repository';
import { TasksRepository } from '../tasks/tasks.repository';

const LESSON_WEEKDAY_ORDER = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const;

type LessonWeekday = (typeof LESSON_WEEKDAY_ORDER)[number];

const JS_DAY_TO_LESSON_WEEKDAY: Record<number, LessonWeekday> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

@Injectable()
export class HomeService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  async getStudentHome(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const cairoNow = this.getCairoNow();
    const today = this.formatDateAsIso(cairoNow);
    const weekday = this.getLessonWeekdayFromDate(cairoNow);

    const [todayTasks, todayLessons] = await Promise.all([
      this.tasksRepository.listTodayTasksByStudent(studentId, today),
      this.lessonsRepository.listTodayLessonsByStudent(studentId, weekday, today),
    ]);

    const completedTasks = todayTasks.filter((task) => task.status === 'done').length;
    const checkedLessons = todayLessons.filter((lesson) => lesson.checked).length;
    const completedCount = completedTasks + checkedLessons;
    const totalCount = todayTasks.length + todayLessons.length;

    return {
      progress: {
        completedCount,
        totalCount,
        progressPercent:
          totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
      },
      todayTasks,
      todayLessons,
    };
  }

  private getCairoNow() {
    return new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
      }),
    );
  }

  private getLessonWeekdayFromDate(date: Date): LessonWeekday {
    return JS_DAY_TO_LESSON_WEEKDAY[date.getDay()];
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
