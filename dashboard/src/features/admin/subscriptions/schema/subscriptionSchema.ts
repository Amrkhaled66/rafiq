import { z } from "zod";

export const subscriptionSchema = z.object({
  studentPhone: z.string().trim().min(1, "رقم هاتف الطالب مطلوب"),
  packageId: z.coerce.number().int().min(1, "الباقة مطلوبة"),
  startsAt: z.string().min(1, "تاريخ البداية مطلوب"),
  amountPaid: z.coerce.number().int().min(0, "المبلغ المدفوع يجب ألا يكون سالبًا"),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
export type SubscriptionFormInput = z.input<typeof subscriptionSchema>;
