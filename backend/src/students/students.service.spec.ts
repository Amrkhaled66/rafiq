import { BadRequestException } from '@nestjs/common';
import { StudentsService } from './students.service';
import type {
  StudentSubjectPerformanceRow,
  StudentTaskCompletionTrendRow,
  StudentsRepository,
} from './students.repository';
import type {
  StudentDailyStudyTimeRow,
  StudentStudyTimeBySubjectRow,
  TaskSessionsRepository,
} from '../task-sessions/task-sessions.repository';

describe('StudentsService analytics', () => {
  const student = {
    id: 12,
    fullName: 'Test Student',
    phone: '01000000000',
    role: 'student' as const,
    city: 'cairo' as const,
    parentPhone: '01000000001',
    gradeLevel: 'grade_1' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as never;

  function createService(
    input: {
      daily?: StudentDailyStudyTimeRow[];
      taskCompletionTrend?: StudentTaskCompletionTrendRow[];
      subjectPerformance?: StudentSubjectPerformanceRow[];
      studyTimeBySubject?: StudentStudyTimeBySubjectRow[];
    } = {},
  ) {
    const studentsRepository = {
      findByUserId: jest.fn().mockResolvedValue(student),
      getStudentTaskCompletionTrend: jest
        .fn()
        .mockResolvedValue(input.taskCompletionTrend ?? []),
      getStudentSubjectPerformance: jest
        .fn()
        .mockResolvedValue(input.subjectPerformance ?? []),
    } as unknown as jest.Mocked<StudentsRepository>;
    const taskSessionsRepository = {
      getStudentDailyStudyTime: jest.fn().mockResolvedValue(input.daily ?? []),
      getStudentStudyTimeBySubject: jest
        .fn()
        .mockResolvedValue(input.studyTimeBySubject ?? []),
    } as unknown as jest.Mocked<TaskSessionsRepository>;

    const service = new StudentsService(
      studentsRepository,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      taskSessionsRepository,
    );

    return { service, studentsRepository, taskSessionsRepository };
  }

  it('returns study-time summary for the selected interval', async () => {
    const { service, taskSessionsRepository } = createService({
      daily: [
        { date: '2026-09-17', totalStudySeconds: 3600, sessionsCount: 2 },
        { date: '2026-09-19', totalStudySeconds: 1800, sessionsCount: 1 },
      ],
      taskCompletionTrend: [
        {
          date: '2026-09-17',
          totalTasks: 4,
          completedTasks: 3,
          missedTasks: 1,
        },
      ],
      subjectPerformance: [
        {
          subject: 'math',
          totalTasks: 5,
          completedTasks: 4,
          missedTasks: 1,
          inProgressTasks: 0,
          pendingTasks: 0,
        },
      ],
      studyTimeBySubject: [
        { subject: 'math', totalStudySeconds: 5400, sessionsCount: 3 },
      ],
    });

    await expect(
      service.getStudentStudyTimeAnalytics(12, {
        from: '2026-09-17',
        to: '2026-09-19',
      }),
    ).resolves.toEqual({
      student: { id: 12, fullName: 'Test Student' },
      interval: { from: '2026-09-17', to: '2026-09-19' },
      summary: {
        totalStudySeconds: 5400,
        totalStudyMinutes: 90,
        averageDailyMinutes: 30,
        activeDays: 2,
      },
      daily: [
        {
          date: '2026-09-17',
          totalStudySeconds: 3600,
          totalStudyMinutes: 60,
          sessionsCount: 2,
        },
        {
          date: '2026-09-19',
          totalStudySeconds: 1800,
          totalStudyMinutes: 30,
          sessionsCount: 1,
        },
      ],
      taskCompletionTrend: [
        {
          date: '2026-09-17',
          totalTasks: 4,
          completedTasks: 3,
          missedTasks: 1,
          completionRate: 75,
        },
      ],
      subjectPerformance: [
        {
          subject: 'math',
          totalTasks: 5,
          completedTasks: 4,
          missedTasks: 1,
          inProgressTasks: 0,
          pendingTasks: 0,
          completionRate: 80,
        },
      ],
      studyTimeBySubject: [
        {
          subject: 'math',
          totalStudySeconds: 5400,
          totalStudyMinutes: 90,
          sessionsCount: 3,
        },
      ],
    });
    expect(taskSessionsRepository.getStudentDailyStudyTime).toHaveBeenCalledWith({
      studentId: 12,
      from: '2026-09-17',
      to: '2026-09-19',
    });
  });

  it('rejects a reversed interval', async () => {
    const { service } = createService();

    await expect(
      service.getStudentStudyTimeAnalytics(12, {
        from: '2026-09-19',
        to: '2026-09-17',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects ranges longer than 90 days', async () => {
    const { service } = createService();

    await expect(
      service.getStudentStudyTimeAnalytics(12, {
        from: '2026-01-01',
        to: '2026-04-02',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
