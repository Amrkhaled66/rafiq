import { z } from "zod";

export const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "اسم الدرس مطلوب")
    .max(255, "اسم الدرس يجب ألا يتجاوز 255 حرفًا"),
  subject: z.string().trim().min(1, "المادة مطلوبة"),
  scheduledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الدرس مطلوب"),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

