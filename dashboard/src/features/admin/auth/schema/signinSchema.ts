import { z } from "zod";

export const signinSchema = z.object({
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب"),
  password: z
    .string()
    .trim()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
