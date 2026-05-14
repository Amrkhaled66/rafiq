import { z } from "zod";
import { EGYPT_CITIES } from "@/shared/const/cities";
import { STUDENT_GRADE_KEYS } from "@/shared/const/grades";

const cityKeys = EGYPT_CITIES.map(({ key }) => key) as [
  (typeof EGYPT_CITIES)[number]["key"],
  ...(typeof EGYPT_CITIES)[number]["key"][],
];

const gradeKeys = Object.values(STUDENT_GRADE_KEYS) as [
  (typeof STUDENT_GRADE_KEYS)[keyof typeof STUDENT_GRADE_KEYS],
  ...(typeof STUDENT_GRADE_KEYS)[keyof typeof STUDENT_GRADE_KEYS][],
];

export const updateStudentSchema = z.object({
  fullName: z.string().trim().min(1, "اسم الطالب مطلوب"),
  phone: z.string().trim().min(1, "رقم هاتف الطالب مطلوب"),
  city: z.enum(cityKeys, {
    error: "المحافظة مطلوبة",
  }),
  parentPhone: z.string().trim().min(1, "رقم هاتف ولي الأمر مطلوب"),
  gradeLevel: z.enum(gradeKeys, {
    error: "الصف الدراسي مطلوب",
  }),
  password: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || value.length >= 6,
      "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
    ),
});

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;
