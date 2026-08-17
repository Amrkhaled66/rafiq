export const SCHOOL_SUBJECT_OPTIONS = [
  { label: "لغة عربية", value: "arabic" },
  { label: "انجليزي", value: "english" },
  { label: "لغة أجنبية ثانية", value: "second_foreign_language" },
  { label: "رياضيات", value: "math" },
  { label: "فيزياء", value: "physics" },
  { label: "كيمياء", value: "chemistry" },
  { label: "أحياء", value: "biology" },
  { label: "تاريخ", value: "history" },
  { label: "جغرافيا", value: "geography" },
  { label: "إحصاء", value: "statistics" },
  { label: "دين", value: "religion" },
  { label: "تربية وطنية", value: "national_education" },
] as const;

export const SCHOOL_SUBJECT_LABELS = Object.fromEntries(
  SCHOOL_SUBJECT_OPTIONS.map((item) => [item.value, item.label]),
) as Record<string, string>;
