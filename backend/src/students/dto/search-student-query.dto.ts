import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹';

export function normalizePhoneNumber(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(new RegExp(`[${ARABIC_DIGITS}]`, 'g'), (digit) => {
      const index = ARABIC_DIGITS.indexOf(digit);
      return String(index % 10);
    })
    .replace(/\D/g, '');
}

export class SearchStudentQueryDto {
  @Transform(({ value }) => normalizePhoneNumber(value))
  @Matches(/^01[0125]\d{8}$/, {
    message: 'phone must be a valid Egyptian mobile number',
  })
  phone!: string;
}
