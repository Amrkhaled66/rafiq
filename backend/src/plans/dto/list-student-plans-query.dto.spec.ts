import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListStudentPlansQueryDto } from './list-student-plans-query.dto';

describe('ListStudentPlansQueryDto', () => {
  it('accepts and transforms valid pagination and status values', async () => {
    const query = plainToInstance(ListStudentPlansQueryDto, {
      page: '2',
      limit: '10',
      status: 'active',
    });

    await expect(validate(query)).resolves.toHaveLength(0);
    expect(query).toMatchObject({ page: 2, limit: 10, status: 'active' });
  });

  it('rejects unsupported status values', async () => {
    const query = plainToInstance(ListStudentPlansQueryDto, {
      status: 'paused',
    });

    const errors = await validate(query);

    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'status' })]),
    );
  });
});
