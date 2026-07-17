import { BadRequestException, ConflictException } from '@nestjs/common';
import { TaskSessionRow } from './task-sessions.repository';
import { TaskSessionsService } from './task-sessions.service';

const baseSession: TaskSessionRow = {
  id: 10,
  taskId: 20,
  studentId: 30,
  startedAt: new Date('2026-07-07T10:00:00.000Z'),
  endedAt: null,
  expectedEndAt: new Date('2026-07-07T10:01:00.000Z'),
  accumulatedSeconds: 60,
  lastStartedAt: new Date('2026-07-07T10:05:00.000Z'),
  durationSeconds: 60,
  status: 'running',
};

describe('TaskSessionsService', () => {
  let repository: {
    createTaskSession: jest.Mock;
    completeExpiredRunningSessions: jest.Mock;
    findActiveTaskSession: jest.Mock;
    findActiveTaskSessionByStudent: jest.Mock;
    findTaskSessionById: jest.Mock;
    getTaskSessionStats: jest.Mock;
    getTaskSessionStatsByTask: jest.Mock;
    listTaskSessions: jest.Mock;
    listTaskSessionsByTask: jest.Mock;
    updateTaskSession: jest.Mock;
  };
  let service: TaskSessionsService;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-07T10:06:30.000Z'));

    repository = {
      createTaskSession: jest.fn(),
      completeExpiredRunningSessions: jest.fn(),
      findActiveTaskSession: jest.fn(),
      findActiveTaskSessionByStudent: jest.fn(),
      findTaskSessionById: jest.fn(),
      getTaskSessionStats: jest.fn(),
      getTaskSessionStatsByTask: jest.fn(),
      listTaskSessions: jest.fn(),
      listTaskSessionsByTask: jest.fn(),
      updateTaskSession: jest.fn(),
    };

    service = new TaskSessionsService(repository as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts a new session when the student has no active session', async () => {
    repository.findActiveTaskSessionByStudent.mockResolvedValue(undefined);
    repository.createTaskSession.mockResolvedValue({
      ...baseSession,
      accumulatedSeconds: 0,
      durationSeconds: 0,
      lastStartedAt: new Date('2026-07-07T10:06:30.000Z'),
      expectedEndAt: new Date('2026-07-07T10:07:30.000Z'),
    });

    const result = await service.startTaskSession(30, 20);

    expect(repository.findActiveTaskSessionByStudent).toHaveBeenCalledWith({
      studentId: 30,
    });
    expect(repository.createTaskSession).toHaveBeenCalledWith({
      studentId: 30,
      taskId: 20,
      startedAt: new Date('2026-07-07T10:06:30.000Z'),
      expectedEndAt: new Date('2026-07-07T10:07:30.000Z'),
    });
    expect(result.status).toBe('running');
    expect(result.expectedEndAt).toEqual(new Date('2026-07-07T10:07:30.000Z'));
  });

  it('rejects starting a new session when the same task already has an active session', async () => {
    repository.findActiveTaskSessionByStudent.mockResolvedValue(baseSession);

    await expect(service.startTaskSession(30, 20)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(repository.createTaskSession).not.toHaveBeenCalled();
  });

  it('rejects starting a new session when another task already has an active session', async () => {
    repository.findActiveTaskSessionByStudent.mockResolvedValue({
      ...baseSession,
      taskId: 21,
    });

    await expect(service.startTaskSession(30, 20)).rejects.toMatchObject({
      response: expect.objectContaining({
        activeSession: expect.objectContaining({
          id: baseSession.id,
          taskId: 21,
          status: 'running',
        }),
      }),
    });

    expect(repository.createTaskSession).not.toHaveBeenCalled();
  });

  it('pauses a running session and preserves accumulated duration', async () => {
    repository.findTaskSessionById.mockResolvedValue({
      ...baseSession,
      accumulatedSeconds: 10,
      durationSeconds: 40,
      lastStartedAt: new Date('2026-07-07T10:06:00.000Z'),
    });
    repository.updateTaskSession.mockImplementation(async (input) => ({
      ...baseSession,
      ...input,
      durationSeconds: input.accumulatedSeconds,
    }));

    const result = await service.pauseTaskSession(baseSession.id, 40);

    expect(repository.updateTaskSession).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: baseSession.id,
        status: 'paused',
        accumulatedSeconds: 40,
        lastStartedAt: null,
        expectedEndAt: null,
      }),
    );
    expect(result.status).toBe('paused');
    expect(result.durationSeconds).toBe(40);
  });

  it('persists the frontend elapsed time instead of request arrival time', async () => {
    repository.findTaskSessionById.mockResolvedValue({
      ...baseSession,
      accumulatedSeconds: 0,
      durationSeconds: 23,
      lastStartedAt: new Date('2026-07-07T10:06:04.000Z'),
    });
    repository.updateTaskSession.mockImplementation(async (input) => ({
      ...baseSession,
      ...input,
      durationSeconds: input.accumulatedSeconds,
    }));

    const result = await service.pauseTaskSession(baseSession.id, 23);

    expect(repository.updateTaskSession).toHaveBeenCalledWith(
      expect.objectContaining({
        accumulatedSeconds: 23,
        updatedAt: new Date('2026-07-07T10:06:30.000Z'),
      }),
    );
    expect(result.durationSeconds).toBe(23);
  });

  it('rejects elapsed time outside the accepted latency range', async () => {
    repository.findTaskSessionById.mockResolvedValue({
      ...baseSession,
      accumulatedSeconds: 0,
      lastStartedAt: new Date('2026-07-07T10:06:00.000Z'),
    });

    await expect(
      service.pauseTaskSession(baseSession.id, 19),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(repository.updateTaskSession).not.toHaveBeenCalled();
  });

  it('rejects pausing a non-running session', async () => {
    repository.findTaskSessionById.mockResolvedValue({
      ...baseSession,
      status: 'paused',
      accumulatedSeconds: 10,
      durationSeconds: 10,
      lastStartedAt: null,
    });

    await expect(
      service.pauseTaskSession(baseSession.id, 10),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('resumes only paused sessions', async () => {
    repository.findTaskSessionById.mockResolvedValue({
      ...baseSession,
      status: 'paused',
      accumulatedSeconds: 10,
      durationSeconds: 10,
      lastStartedAt: null,
    });
    repository.updateTaskSession.mockImplementation(async (input) => ({
      ...baseSession,
      ...input,
      durationSeconds: input.accumulatedSeconds,
    }));

    const result = await service.resumeTaskSession(
      baseSession.id,
      '2026-07-07T10:07:17.000Z',
    );

    expect(repository.updateTaskSession).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'running',
        accumulatedSeconds: 10,
        lastStartedAt: new Date('2026-07-07T10:06:27.000Z'),
        expectedEndAt: new Date('2026-07-07T10:07:17.000Z'),
      }),
    );
    expect(result.status).toBe('running');
  });

  it('completes only running sessions', async () => {
    repository.findTaskSessionById.mockResolvedValue(baseSession);
    repository.updateTaskSession.mockImplementation(async (input) => ({
      ...baseSession,
      ...input,
      durationSeconds: input.accumulatedSeconds,
    }));

    const result = await service.completeTaskSession(baseSession.id);

    expect(repository.updateTaskSession).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        accumulatedSeconds: 60,
        endedAt: new Date('2026-07-07T10:01:00.000Z'),
        lastStartedAt: null,
        expectedEndAt: null,
      }),
    );
    expect(result.status).toBe('completed');
  });

  it('returns an already completed session without updating it again', async () => {
    repository.findTaskSessionById.mockResolvedValue({
      ...baseSession,
      status: 'completed',
      endedAt: baseSession.expectedEndAt,
      expectedEndAt: null,
      lastStartedAt: null,
      accumulatedSeconds: 60,
      durationSeconds: 60,
    });

    const result = await service.completeTaskSession(baseSession.id);

    expect(result.status).toBe('completed');
    expect(repository.updateTaskSession).not.toHaveBeenCalled();
  });

  it('cancels an active session and keeps elapsed duration', async () => {
    repository.findTaskSessionById.mockResolvedValue(baseSession);
    repository.updateTaskSession.mockImplementation(async (input) => ({
      ...baseSession,
      ...input,
      durationSeconds: input.accumulatedSeconds,
    }));

    const result = await service.cancelTaskSession(baseSession.id);

    expect(repository.updateTaskSession).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'cancelled',
        accumulatedSeconds: 150,
        endedAt: new Date('2026-07-07T10:06:30.000Z'),
        lastStartedAt: null,
        expectedEndAt: null,
      }),
    );
    expect(result.status).toBe('cancelled');
    expect(result.durationSeconds).toBe(150);
  });

  it('runs expiry completion through the repository', async () => {
    repository.completeExpiredRunningSessions.mockResolvedValue([]);

    await service.completeExpiredRunningSessions();

    expect(repository.completeExpiredRunningSessions).toHaveBeenCalledWith({
      now: new Date('2026-07-07T10:06:30.000Z'),
    });
  });
});
