import { PlansService } from './plans.service';
import type { PlansRepository } from './plans.repository';
import type { StudentsRepository } from '../students/students.repository';
import type { CoachesRepository } from '../coaches/coaches.repository';
import type { ListStudentPlansQueryDto } from './dto/list-student-plans-query.dto';

describe('PlansService pagination', () => {
  const listStudentPlans = jest.fn();
  const getStudentPlansStats = jest.fn();
  const findStudentByUserId = jest.fn();

  const service = new PlansService(
    {
      listStudentPlans,
      getStudentPlansStats,
    } as unknown as PlansRepository,
    {
      findByUserId: findStudentByUserId,
    } as unknown as StudentsRepository,
    {} as CoachesRepository,
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
});
