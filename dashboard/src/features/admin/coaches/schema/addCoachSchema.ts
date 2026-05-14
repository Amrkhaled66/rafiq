import { z } from "zod";
import { signinSchema } from "@/features/admin/auth/schema/signinSchema";

export const addCoachSchema = signinSchema.extend({
  fullName: z.string().trim().min(1, "اسم المدرب مطلوب"),
});

export type AddCoachFormValues = z.infer<typeof addCoachSchema>;
