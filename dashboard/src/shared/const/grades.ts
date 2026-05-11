export const STUDENT_GRADE_KEYS = {
  FIRST_SECONDARY: "first_secondary",
  SECOND_SECONDARY: "second_secondary",
  THIRD_SECONDARY: "third_secondary",
} as const;

export type StudentGrade =
  (typeof STUDENT_GRADE_KEYS)[keyof typeof STUDENT_GRADE_KEYS];

export const STUDENT_GRADES: Record<StudentGrade, string> = {
  first_secondary: "الصف الأول الثانوي",
  second_secondary: "الصف الثاني الثانوي",
  third_secondary: "الصف الثالث الثانوي",
};

export const STUDENT_GRADES_CLASSES: Record<StudentGrade, string> = {
  first_secondary: "bg-blue-100 text-blue-800",
  second_secondary: "bg-green-100 text-green-800",
  third_secondary: "bg-brand-primary/10 text-brand-primary",
};