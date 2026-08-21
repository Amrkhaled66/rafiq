import { BadRequestException } from '@nestjs/common';
import { addIsoDateDays, getCairoDateString } from '../common/dates/cairo-date';
import type { TasksService } from '../tasks/tasks.service';
import type { DailyTaskProgressRepository } from './daily-task-progress.repository';
import { DailyTaskProgressService } from './daily-task-progress.service';
import type { ListDailyTaskProgressQueryDto } from './dto/list-daily-task-progress-query.dto';

describe('DailyTaskProgressService', () => {
  const list = jest.fn();
  const synchronizeMissedTasks = jest.fn();
  const service = new DailyTaskProgressService(
    { list } as unknown as DailyTaskProgressRepository,
    { synchronizeMissedTasks } as unknown as TasksService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    synchronizeMissedTasks.mockResolvedValue(undefined);
    list.mockResolvedValue({
      summary: { finishedStudents: 1, unfinishedStudents: 2 },
      items: [],
      page: 1,
      limit: 10,
      total: 2,
    });
  });

  it('synchronizes missed tasks and forwards report options with user scope', async () => {
    const date = addIsoDateDays(getCairoDateString(), -1);
    const query = {
      date,
      status: 'unfinished',
      page: 2,
      limit: 20,
      sortBy: 'missedTasks',
      sortOrder: 'desc',
    } as ListDailyTaskProgressQueryDto;

    await service.list(query, {
      sub: 17,
      role: 'coach',
    });

    expect(synchronizeMissedTasks).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith({
      role: 'coach',
      userId: 17,
      date,
      status: 'unfinished',
      page: 2,
      limit: 20,
      sortBy: 'missedTasks',
      sortOrder: 'desc',
    });
  });

  it('allows finished progress for today', async () => {
    const date = getCairoDateString();

    await service.list(
      {
        date,
        status: 'finished',
        page: 1,
        limit: 10,
        sortBy: 'studentName',
        sortOrder: 'asc',
      },
      { sub: 1, role: 'super_admin' },
    );

    expect(synchronizeMissedTasks).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith({
      role: 'super_admin',
      userId: 1,
      date,
      status: 'finished',
      page: 1,
      limit: 10,
      sortBy: 'studentName',
      sortOrder: 'asc',
    });
  });

  it('rejects unfinished progress for today before synchronizing or querying', async () => {
    await expect(
      service.list(
        {
          date: getCairoDateString(),
          status: 'unfinished',
          page: 1,
          limit: 10,
          sortBy: 'missedTasks',
          sortOrder: 'desc',
        },
        { sub: 1, role: 'super_admin' },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(synchronizeMissedTasks).not.toHaveBeenCalled();
    expect(list).not.toHaveBeenCalled();
  });

  it('rejects an impossible historical calendar date', async () => {
    await expect(
      service.list(
        {
          date: '2020-02-31',
          status: 'unfinished',
          page: 1,
          limit: 10,
          sortBy: 'missedTasks',
          sortOrder: 'desc',
        },
        { sub: 1, role: 'super_admin' },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
