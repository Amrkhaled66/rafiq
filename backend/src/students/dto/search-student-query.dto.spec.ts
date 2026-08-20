import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  normalizePhoneNumber,
  SearchStudentQueryDto,
} from './search-student-query.dto';

describe('normalizePhoneNumber', () => {
  it.each([
    ['01012345678', '01012345678'],
    ['010-1234-5678', '01012345678'],
    ['٠١٠ ١٢٣٤ ٥٦٧٨', '01012345678'],
    ['۰۱۰ ۱۲۳۴ ۵۶۷۸', '01012345678'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizePhoneNumber(input)).toBe(expected);
  });

  it('returns an empty value for non-string input', () => {
    expect(normalizePhoneNumber(undefined)).toBe('');
  });

  it.each(['01012345678', '٠١٠ ١٢٣٤ ٥٦٧٨'])(
    'accepts the valid Egyptian number %s',
    async (phone) => {
      const dto = plainToInstance(SearchStudentQueryDto, { phone });
      await expect(validate(dto)).resolves.toHaveLength(0);
    },
  );

  it.each(['', '1012345678', '0101234', '01312345678'])(
    'rejects the invalid number %s',
    async (phone) => {
      const dto = plainToInstance(SearchStudentQueryDto, { phone });
      await expect(validate(dto)).resolves.not.toHaveLength(0);
    },
  );
});
