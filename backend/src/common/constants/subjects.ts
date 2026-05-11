export const SCHOOL_SUBJECTS = [
  { key: 'arabic', value: 'Arabic' },
  { key: 'english', value: 'English' },
  { key: 'math', value: 'Math' },
  { key: 'physics', value: 'Physics' },
  { key: 'chemistry', value: 'Chemistry' },
  { key: 'biology', value: 'Biology' },
  { key: 'geology', value: 'Geology' },
  { key: 'history', value: 'History' },
  { key: 'geography', value: 'Geography' },
  { key: 'philosophy', value: 'Philosophy' },
  { key: 'psychology', value: 'Psychology' },
  { key: 'french', value: 'French' },
  { key: 'german', value: 'German' },
  { key: 'italian', value: 'Italian' },
  { key: 'spanish', value: 'Spanish' },
  { key: 'computer_science', value: 'Computer Science' },
  { key: 'religion', value: 'Religion' },
  { key: 'national_education', value: 'National Education' },
  { key: 'economics', value: 'Economics' },
  { key: 'statistics', value: 'Statistics' },
] as const;

export type SchoolSubjectKey = (typeof SCHOOL_SUBJECTS)[number]['key'];

export const SCHOOL_SUBJECT_ENUM_VALUES = SCHOOL_SUBJECTS.map(
  ({ key }) => key,
) as [SchoolSubjectKey, ...SchoolSubjectKey[]];
