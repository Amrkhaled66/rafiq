export const LESSON_WEEKDAY_VALUES = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export const LESSON_WEEKDAY_OPTIONS = [
  { value: "saturday", label: "السبت" },
  { value: "sunday", label: "الأحد" },
  { value: "monday", label: "الاثنين" },
  { value: "tuesday", label: "الثلاثاء" },
  { value: "wednesday", label: "الأربعاء" },
  { value: "thursday", label: "الخميس" },
  { value: "friday", label: "الجمعة" },
] as const;

export const LESSON_WEEKDAY_LABELS = Object.fromEntries(
  LESSON_WEEKDAY_OPTIONS.map((item) => [item.value, item.label]),
) as Record<string, string>;

export const LESSON_WEEKDAY_ORDER = LESSON_WEEKDAY_OPTIONS.map(
  (item) => item.value,
);
