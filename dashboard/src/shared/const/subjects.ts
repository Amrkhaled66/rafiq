export const SCHOOL_SUBJECT_OPTIONS = [
  { label: "لغة عربية", value: "arabic" },
  { label: "لغة إنجليزية", value: "english" },
  { label: "رياضيات", value: "math" },
  { label: "فيزياء", value: "physics" },
  { label: "كيمياء", value: "chemistry" },
  { label: "أحياء", value: "biology" },
  { label: "جيولوجيا", value: "geology" },
  { label: "تاريخ", value: "history" },
  { label: "جغرافيا", value: "geography" },
  { label: "فلسفة", value: "philosophy" },
  { label: "علم نفس", value: "psychology" },
  { label: "فرنسي", value: "french" },
  { label: "ألماني", value: "german" },
  { label: "إيطالي", value: "italian" },
  { label: "إسباني", value: "spanish" },
  { label: "حاسب آلي", value: "computer_science" },
  { label: "دين", value: "religion" },
  { label: "تربية وطنية", value: "national_education" },
  { label: "اقتصاد", value: "economics" },
  { label: "إحصاء", value: "statistics" },
] as const;

export const SCHOOL_SUBJECT_LABELS = Object.fromEntries(
  SCHOOL_SUBJECT_OPTIONS.map((item) => [item.value, item.label]),
) as Record<string, string>;

