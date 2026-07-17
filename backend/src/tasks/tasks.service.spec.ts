import { ConflictException } from '@nestjs/common';
import { StudentsRepository } from '../students/students.repository';
import { TaskSessionsService } from '../task-sessions/task-sessions.service';
import { TasksRepository, type StudentTaskDetailRow } from './tasks.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const studentId = 2;
  const taskId = 29;
  const pendingTask: StudentTaskDetailRow = {
    id: taskId,
    title: 'Task',
    subject: 'math',
    status: 'in_progress',
    dueAt: '2026-07-11',
    planId: 4,
    completedAt: null,
  };

  const tasksRepository = {
    findTaskByStudent: jest.fn(),
    markTaskDone: jest.fn(),
    markOverdueTasksMissed: jest.fn(),
  };
  const studentsRepository = {
    findByUserId: jest.fn(),
  };
  const taskSessionsService = {
    getTaskSessionsSnapshot: jest.fn(),
    startTaskSession: jest.fn(),
  };
  const service = new TasksService(
    tasksRepository as unknown as TasksRepository,
    studentsRepository as unknown as StudentsRepository,
    taskSessionsService as unknown as TaskSessionsService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    studentsRepository.findByUserId.mockResolvedValue({ id: studentId });
    tasksRepository.findTaskByStudent.mockResolvedValue(pendingTask);
    taskSessionsService.getTaskSessionsSnapshot.mockResolvedValue({
      activeSession: null,
      sessions: [],
      stats: {},
    });
  });

  it('completes a task without an active session', async () => {
    const completedAt = new Date();
    tasksRepository.markTaskDone.mockResolvedValue({
      id: taskId,
      status: 'done',
      completedAt,
    });

    await expect(
      service.completeStudentTask(studentId, taskId),
    ).resolves.toEqual({
      id: taskId,
      status: 'completed',
      completedAt,
    });
  });

  it('returns an already completed task without updating it', async () => {
    const completedAt = new Date();
    tasksRepository.findTaskByStudent.mockResolvedValue({
      ...pendingTask,
      status: 'done',
      completedAt,
    });

    await expect(
      service.completeStudentTask(studentId, taskId),
    ).resolves.toEqual({
      id: taskId,
      status: 'completed',
      completedAt,
    });
    expect(tasksRepository.markTaskDone).not.toHaveBeenCalled();
  });

  it('rejects completion while the task has an active session', async () => {
    taskSessionsService.getTaskSessionsSnapshot.mockResolvedValue({
      activeSession: { id: 10, status: 'paused' },
      sessions: [],
      stats: {},
    });

    await expect(
      service.completeStudentTask(studentId, taskId),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tasksRepository.markTaskDone).not.toHaveBeenCalled();
  });

  it('rejects starting a session for a completed task', async () => {
    tasksRepository.findTaskByStudent.mockResolvedValue({
      ...pendingTask,
      status: 'done',
      completedAt: new Date(),
    });

    await expect(
      service.startStudentTaskSession(studentId, taskId),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(taskSessionsService.startTaskSession).not.toHaveBeenCalled();
  });

  it('synchronizes overdue tasks using the Cairo calendar date', async () => {
    tasksRepository.markOverdueTasksMissed.mockResolvedValue([{ id: taskId }]);

    await expect(
      service.synchronizeMissedTasks(new Date('2026-07-11T22:30:00.000Z')),
    ).resolves.toEqual([{ id: taskId }]);
    expect(tasksRepository.markOverdueTasksMissed).toHaveBeenCalledWith(
      '2026-07-12',
    );
  });
});
