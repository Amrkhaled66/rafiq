import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { TASK_FOCUS_DURATION_SECONDS } from '../tasks/task-focus-duration';
import { ListTaskSessionsQueryDto } from './dto/list-task-sessions-query.dto';
import {
  TaskSessionRow,
  TaskSessionStatus,
  TaskSessionsRepository,
} from './task-sessions.repository';

@Injectable()
export class TaskSessionsService {
  constructor(
    private readonly taskSessionsRepository: TaskSessionsRepository,
  ) { }

  async listTaskSessions(
    query: ListTaskSessionsQueryDto,
    user: AuthenticatedUser,
  ) {
    await this.completeExpiredRunningSessions();

    if (query.from && query.to && query.to < query.from) {
      throw new BadRequestException('to must be >= from');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filters = {
      role: user.role as 'coach' | 'super_admin',
      userId: user.sub,
      studentPhone: query.studentPhone,
      status: query.status,
      from: query.from,
      to: query.to,
    };

    const [stats, list] = await Promise.all([
      this.taskSessionsRepository.getTaskSessionStats(filters),
      this.taskSessionsRepository.listTaskSessions({
        ...filters,
        page,
        limit,
      }),
    ]);

    return {
      stats,
      items: list.items,
      page: list.page,
      limit: list.limit,
      total: list.total,
    };
  }

  async listTaskSessionsByTask(studentId: number, taskId: number) {
    await this.completeExpiredRunningSessions();

    const sessions = await this.taskSessionsRepository.listTaskSessionsByTask({
      studentId,
      taskId,
    });

    return {
      items: sessions.map((session) => this.serializeSession(session)),
      total: sessions.length,
    };
  }

  async getTaskSessionStatsByTask(studentId: number, taskId: number) {
    await this.completeExpiredRunningSessions();

    return this.taskSessionsRepository.getTaskSessionStatsByTask({
      studentId,
      taskId,
    });
  }

  async getTaskSessionsSnapshot(studentId: number, taskId: number) {
    await this.completeExpiredRunningSessions();

    const [sessions, stats, activeSession] = await Promise.all([
      this.taskSessionsRepository.listTaskSessionsByTask({ studentId, taskId }),
      this.getTaskSessionStatsByTask(studentId, taskId),
      this.taskSessionsRepository.findActiveTaskSession({ studentId, taskId }),
    ]);

    return {
      activeSession: activeSession
        ? this.serializeSession(activeSession)
        : null,
      sessions: sessions.map((session) => this.serializeSession(session)),
      stats,
    };
  }

  async startTaskSession(studentId: number, taskId: number) {
    const activeSession = await this.taskSessionsRepository.findActiveTaskSessionByStudent({
      studentId,
    });

    if (activeSession) {
      throw new ConflictException({
        message: 'Student already has an active task session',
        activeSession: this.serializeSession(activeSession),
      });
    }

    const startedAt = new Date();
    const session = await this.taskSessionsRepository.createTaskSession({
      studentId,
      taskId,
      startedAt,
      expectedEndAt: this.addSeconds(startedAt, TASK_FOCUS_DURATION_SECONDS),
    });

    return this.serializeSession(session);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async completeExpiredRunningSessions() {
    await this.taskSessionsRepository.completeExpiredRunningSessions({
      now: new Date(),
    });
  }

  async pauseTaskSession(sessionId: number, elapsedSeconds: number) {
    const session = await this.findTaskSessionOrThrow(sessionId);

    if (session.status !== 'running') {
      throw new BadRequestException('Only running sessions can be paused');
    }

    const receivedAt = new Date();
    const pauseAt = this.resolvePauseAt(
      elapsedSeconds,
      session,
      receivedAt,
    );

    return this.transitionSession(session, 'paused', pauseAt, receivedAt);
  }

  async resumeTaskSession(sessionId: number, expectedEndAt: string) {
    const session = await this.findTaskSessionOrThrow(sessionId);

    if (session.status !== 'paused') {
      throw new BadRequestException('Only paused sessions can be resumed');
    }

    const resumedAt = new Date();
    const requestedExpectedEndAt = new Date(expectedEndAt);
    const remainingSeconds = Math.max(
      0,
      TASK_FOCUS_DURATION_SECONDS - session.accumulatedSeconds,
    );
    const serverExpectedEndAt = this.addSeconds(resumedAt, remainingSeconds);
    const deadlineDifferenceMs = Math.abs(
      serverExpectedEndAt.getTime() - requestedExpectedEndAt.getTime(),
    );

    if (
      Number.isNaN(requestedExpectedEndAt.getTime()) ||
      requestedExpectedEndAt <= resumedAt ||
      deadlineDifferenceMs > 10_000
    ) {
      throw new ConflictException({
        message: 'Resume deadline is outside the accepted range',
        clientExpectedEndAt: expectedEndAt,
        serverExpectedEndAt,
      });
    }

    const lastStartedAt = new Date(
      requestedExpectedEndAt.getTime() - remainingSeconds * 1000,
    );
    const updated = await this.taskSessionsRepository.updateTaskSession({
      sessionId: session.id,
      status: 'running',
      accumulatedSeconds: session.accumulatedSeconds,
      lastStartedAt,
      expectedEndAt: requestedExpectedEndAt,
      endedAt: session.endedAt,
      updatedAt: resumedAt,
    });

    if (!updated) {
      throw new NotFoundException('Task session not found');
    }

    return this.serializeSession(updated);
  }

  async cancelTaskSession(sessionId: number) {
    const session = await this.findTaskSessionOrThrow(sessionId);

    if (session.status !== 'running' && session.status !== 'paused') {
      throw new BadRequestException('Only active sessions can be cancelled');
    }

    return this.transitionSession(session, 'cancelled');
  }

  async completeTaskSession(sessionId: number) {
    const session = await this.findTaskSessionOrThrow(sessionId);

    if (session.status === 'completed') {
      return this.serializeSession(session);
    }

    if (session.status !== 'running') {
      throw new BadRequestException('Only running sessions can be completed');
    }

    const receivedAt = new Date();
    const completionAt =
      session.expectedEndAt && session.expectedEndAt <= receivedAt
        ? session.expectedEndAt
        : receivedAt;

    return this.transitionSession(
      session,
      'completed',
      completionAt,
      receivedAt,
    );
  }

  private async findTaskSessionOrThrow(sessionId: number) {
    const session = await this.taskSessionsRepository.findTaskSessionById(sessionId);

    if (!session) {
      throw new NotFoundException('Task session not found');
    }

    return session;
  }

  private async transitionSession(
    session: TaskSessionRow,
    status: TaskSessionStatus,
    actionAt = new Date(),
    updatedAt = actionAt,
  ) {
    const accumulatedSeconds = this.resolveAccumulatedSeconds(session, actionAt);
    const expectedEndAt = this.resolveExpectedEndAt(
      status,
      accumulatedSeconds,
      actionAt,
    );
    const updated = await this.taskSessionsRepository.updateTaskSession({
      sessionId: session.id,
      status,
      accumulatedSeconds,
      lastStartedAt: status === 'running' ? actionAt : null,
      expectedEndAt,
      endedAt:
        status === 'completed' || status === 'cancelled'
          ? actionAt
          : session.endedAt,
      updatedAt,
    });

    if (!updated) {
      throw new NotFoundException('Task session not found');
    }

    return this.serializeSession(updated);
  }

  private resolveAccumulatedSeconds(session: TaskSessionRow, now: Date) {
    if (session.status !== 'running' || !session.lastStartedAt) {
      return session.accumulatedSeconds;
    }

    return (
      session.accumulatedSeconds +
      Math.max(
        0,
        Math.floor((now.getTime() - session.lastStartedAt.getTime()) / 1000),
      )
    );
  }

  private resolvePauseAt(
    elapsedSeconds: number,
    session: TaskSessionRow,
    receivedAt: Date,
  ) {
    if (!session.lastStartedAt) {
      throw new ConflictException('Running session has no active segment');
    }

    const elapsedAtReceipt = this.resolveAccumulatedSeconds(session, receivedAt);
    // const delaySeconds = elapsedAtReceipt - elapsedSeconds;
    const differenceSeconds = Math.abs(elapsedAtReceipt - elapsedSeconds);

    if (
      !Number.isInteger(elapsedSeconds) ||
      elapsedSeconds < session.accumulatedSeconds ||
      elapsedSeconds > TASK_FOCUS_DURATION_SECONDS ||
      differenceSeconds > 10
    ) {
      throw new ConflictException({
        message: 'Pause elapsed time is outside the accepted range',
        clientElapsedSeconds: elapsedSeconds,
        serverElapsedSeconds: elapsedAtReceipt,
      });
    }

    return new Date(
      session.lastStartedAt.getTime() +
      (elapsedSeconds - session.accumulatedSeconds) * 1000,
    );
  }

  private resolveExpectedEndAt(
    status: TaskSessionStatus,
    accumulatedSeconds: number,
    now: Date,
  ) {
    if (status !== 'running') {
      return null;
    }

    return this.addSeconds(
      now,
      Math.max(0, TASK_FOCUS_DURATION_SECONDS - accumulatedSeconds),
    );
  }

  private addSeconds(date: Date, seconds: number) {
    return new Date(date.getTime() + seconds * 1000);
  }

  private serializeSession(session: TaskSessionRow) {
    return {
      id: session.id,
      taskId: session.taskId,
      studentId: session.studentId,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      expectedEndAt: session.expectedEndAt,
      activeSegmentStartedAt: session.lastStartedAt,
      durationSeconds: session.durationSeconds,
      status: session.status,
    };
  }
}
