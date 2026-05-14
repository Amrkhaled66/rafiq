import { z } from "zod";

export const updateCoachSchema = z.object({
  fullName: z.string().trim().min(1, "اسم المدرب مطلوب"),
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب"),
  password: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || value.length >= 6,
      "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
    ),
});

export type UpdateCoachFormValues = z.infer<typeof updateCoachSchema>;
