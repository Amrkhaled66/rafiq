import { z } from "zod";

export const subscriptionPackageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "اسم الباقة مطلوب")
    .max(255, "اسم الباقة يجب ألا يتجاوز 255 حرفًا"),
  durationDays: z.coerce.number().int().min(1, "مدة الباقة يجب أن تكون يومًا واحدًا على الأقل"),
  price: z.coerce.number().int().min(0, "سعر الباقة يجب ألا يكون سالبًا"),
});

export type SubscriptionPackageFormValues = z.infer<
  typeof subscriptionPackageSchema
>;
export type SubscriptionPackageFormInput = z.input<
  typeof subscriptionPackageSchema
>;
