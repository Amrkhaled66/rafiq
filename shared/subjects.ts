export const SCHOOL_SUBJECTS = [
  { key: 'arabic', labelAr: 'لغة عربية', labelEn: 'Arabic' },
  { key: 'english', labelAr: 'لغة أجنبية أولى', labelEn: 'First Foreign Language' },
  { key: 'second_foreign_language', labelAr: 'لغة أجنبية ثانية', labelEn: 'Second Foreign Language' },
  { key: 'math', labelAr: 'رياضيات', labelEn: 'Math' },
  { key: 'physics', labelAr: 'فيزياء', labelEn: 'Physics' },
  { key: 'chemistry', labelAr: 'كيمياء', labelEn: 'Chemistry' },
  { key: 'biology', labelAr: 'أحياء', labelEn: 'Biology' },
  { key: 'history', labelAr: 'تاريخ', labelEn: 'History' },
  { key: 'geography', labelAr: 'جغرافيا', labelEn: 'Geography' },
  { key: 'statistics', labelAr: 'إحصاء', labelEn: 'Statistics' },
  { key: 'religion', labelAr: 'دين', labelEn: 'Religion' },
  { key: 'national_education', labelAr: 'تربية وطنية', labelEn: 'National Education' },
] as const;

export type SchoolSubjectKey = (typeof SCHOOL_SUBJECTS)[number]['key'];

export const SCHOOL_SUBJECT_ENUM_VALUES = SCHOOL_SUBJECTS.map(
  ({ key }) => key,
) as [SchoolSubjectKey, ...SchoolSubjectKey[]];
