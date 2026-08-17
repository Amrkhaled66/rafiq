import { PlansService } from './plans.service';
import type { PlansRepository } from './plans.repository';
import type { StudentsRepository } from '../students/students.repository';
import type { CoachesRepository } from '../coaches/coaches.repository';
import type { ListStudentPlansQueryDto } from './dto/list-student-plans-query.dto';
import type { TaskSessionsRepository } from '../task-sessions/task-sessions.repository';
import type { LessonOccurrencesService } from '../lesson-occurrences/lesson-occurrences.service';

describe('PlansService pagination', () => {
  const listStudentPlans = jest.fn();
  const getStudentPlansStats = jest.fn();
  const findStudentByUserId = jest.fn();
  const findPlanByIdAndStudent = jest.fn();
  const listPlanTasks = jest.fn();
  const getPlanTaskSessionStats = jest.fn();
  const listStudentOccurrencesInRange = jest.fn();

  const service = new PlansService(
    {
      listStudentPlans,
      getStudentPlansStats,
      findPlanByIdAndStudent,
      listPlanTasks,
    } as unknown as PlansRepository,
    {
      findByUserId: findStudentByUserId,
    } as unknown as StudentsRepository,
    {} as CoachesRepository,
    {
      getPlanTaskSessionStats,
    } as unknown as TaskSessionsRepository,
    {
      listStudentOccurrencesInRange,
    } as unknown as LessonOccurrencesService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    findStudentByUserId.mockResolvedValue({ id: 12, fullName: 'Student' });
    getStudentPlansStats.mockResolvedValue({
      totalPlans: 3,
      activePlans: 1,
      completedPlans: 1,
      missedTasks: 0,
      upcomingTasks: 1,
    });
    listStudentOccurrencesInRange.mockResolvedValue([]);
  });

  it('forwards page, limit, status, and the Cairo date to the repository', async () => {
    const query = {
      page: 2,
      limit: 1,
      status: 'ended',
    } as ListStudentPlansQueryDto;
    listStudentPlans.mockResolvedValue({
      items: [
        {
          id: 3,
          name: 'Previous plan',
          startsOn: '2020-01-01',
          endsOn: '2020-01-31',
          createdAt: new Date('2020-01-01'),
          totalTasks: 4,
          completedTasks: 3,
          missedTasks: 1,
        },
      ],
      page: 2,
      limit: 1,
      total: 3,
    });

    const response = await service.getStudentPlans(12, query);

    expect(listStudentPlans).toHaveBeenCalledWith(
      12,
      query,
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    );
    expect(response).toMatchObject({ page: 2, limit: 1, total: 3 });
    expect(response.items[0]).toMatchObject({
      id: 3,
      progressPercent: 75,
      status: 'ended',
    });
  });

  it('adds grouped session statistics and zero values to plan tasks', async () => {
    findPlanByIdAndStudent.mockResolvedValue({
      id: 8,
      name: 'Weekly plan',
      startsOn: '2026-08-17',
      endsOn: '2026-08-23',
      createdAt: new Date('2026-08-16T12:00:00Z'),
      coachId: 4,
    });
    listPlanTasks.mockResolvedValue([
      {
        id: 21,
        title: 'Read chapter',
        note: null,
        subject: 'arabic',
        status: 'pending',
        dueAt: '2026-08-17',
      },
      {
        id: 22,
        title: 'Solve exercises',
        note: 'Questions 1-5',
        subject: 'math',
        status: 'done',
        dueAt: '2026-08-17',
      },
    ]);
    getPlanTaskSessionStats.mockResolvedValue([
      {
        taskId: 21,
        totalFocusSeconds: 3600,
        totalSessions: 4,
        runningSessions: 1,
        pausedSessions: 1,
        completedSessions: 1,
        cancelledSessions: 1,
      },
    ]);
    listStudentOccurrencesInRange.mockResolvedValue([
      {
        id: 31,
        lessonId: 7,
        studentId: 12,
        lessonName: 'Physics video',
        subject: 'physics',
        scheduledForDate: '2026-08-18',
        scheduledWeekday: 'tuesday',
        status: 'scheduled',
        watchedOn: null,
      },
    ]);

    const response = await service.getStudentPlanDetail(12, 8);

    expect(getPlanTaskSessionStats).toHaveBeenCalledTimes(1);
    expect(getPlanTaskSessionStats).toHaveBeenCalledWith({
      studentId: 12,
      planId: 8,
    });
    expect(response.days[0].tasks[0].sessionStats).toEqual({
      totalFocusSeconds: 3600,
      totalSessions: 4,
      runningSessions: 1,
      pausedSessions: 1,
      completedSessions: 1,
      cancelledSessions: 1,
    });
    expect(response.days[0].tasks[1].sessionStats).toEqual({
      totalFocusSeconds: 0,
      totalSessions: 0,
      runningSessions: 0,
      pausedSessions: 0,
      completedSessions: 0,
      cancelledSessions: 0,
    });
    expect(response.stats.totalLessons).toBe(1);
    expect(response.lessonDays).toEqual([
      expect.objectContaining({
        date: '2026-08-18',
        lessons: [
          expect.objectContaining({
            occurrenceId: 31,
            lessonId: 7,
            status: 'scheduled',
          }),
        ],
      }),
    ]);
  });
});
