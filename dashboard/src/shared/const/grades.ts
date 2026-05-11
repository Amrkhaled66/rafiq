export const STUDENT_GRADE_KEYS = {
  FIRST_SECONDARY: "first_sec",
  SECOND_SECONDARY: "second_sec",
  THIRD_SECONDARY: "third_sec",
} as const;

export type StudentGrade =
  (typeof STUDENT_GRADE_KEYS)[keyof typeof STUDENT_GRADE_KEYS];

export const STUDENT_GRADES: Record<StudentGrade, string> = {
  first_sec: "الصف الأول الثانوي",
  second_sec: "الصف الثاني الثانوي",
  third_sec: "الصف الثالث الثانوي",
};

export const STUDENT_GRADES_CLASSES: Record<StudentGrade, string> = {
  first_sec: "bg-blue-100 text-blue-800",
  second_sec: "bg-green-100 text-green-800",
  third_sec: "bg-brand-primary/10 text-brand-primary",
};