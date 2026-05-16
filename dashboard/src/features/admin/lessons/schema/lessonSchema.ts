import { z } from "zod";

import { LESSON_WEEKDAY_VALUES } from "@/shared/const/weekdays";

export const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "اسم الدرس مطلوب")
    .max(255, "اسم الدرس يجب ألا يتجاوز 255 حرفًا"),
  subject: z.string().trim().min(1, "المادة مطلوبة"),
  weekday: z.enum(LESSON_WEEKDAY_VALUES, {
    message: "يوم الدرس مطلوب",
  }),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
