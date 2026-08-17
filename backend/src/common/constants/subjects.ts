export const SCHOOL_SUBJECTS = [
  { key: 'arabic', value: 'Arabic' },
  { key: 'english', value: 'English' },
  { key: 'second_foreign_language', value: 'Second Foreign Language' },
  { key: 'math', value: 'Math' },
  { key: 'physics', value: 'Physics' },
  { key: 'chemistry', value: 'Chemistry' },
  { key: 'biology', value: 'Biology' },
  { key: 'history', value: 'History' },
  { key: 'geography', value: 'Geography' },
  { key: 'statistics', value: 'Statistics' },
  { key: 'religion', value: 'Religion' },
  { key: 'national_education', value: 'National Education' },
] as const;

export type SchoolSubjectKey = (typeof SCHOOL_SUBJECTS)[number]['key'];

export const SCHOOL_SUBJECT_ENUM_VALUES = SCHOOL_SUBJECTS.map(
  ({ key }) => key,
) as [SchoolSubjectKey, ...SchoolSubjectKey[]];
