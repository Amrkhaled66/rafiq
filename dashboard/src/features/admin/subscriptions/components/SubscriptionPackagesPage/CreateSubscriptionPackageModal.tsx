import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import {
  subscriptionPackageSchema,
  type SubscriptionPackageFormInput,
  type SubscriptionPackageFormValues,
} from "@/features/admin/subscriptions/schema/subscriptionPackageSchema";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";

export default function CreateSubscriptionPackageModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubscriptionPackageFormValues) => void;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    SubscriptionPackageFormInput,
    undefined,
    SubscriptionPackageFormValues
  >({
    resolver: zodResolver(subscriptionPackageSchema),
    defaultValues: {
      name: "",
      durationDays: 30,
      price: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        name: "",
        durationDays: 30,
        price: 0,
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-2xl space-y-6 overflow-visible rounded-3xl p-6 md:p-8">
        <div className="text-right">
          <h2 className="text-foreground text-2xl font-bold">إضافة باقة جديدة</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 text-right md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <FormInput
              label="اسم الباقة"
              placeholder="اكتب اسم الباقة"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>

          <FormInput
            label="مدة الباقة بالأيام"
            type="number"
            min={1}
            error={errors.durationDays?.message}
            {...register("durationDays", { valueAsNumber: true })}
          />

          <FormInput
            label="سعر الباقة"
            type="number"
            min={0}
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />

          <div className="mt-2 flex flex-col-reverse gap-3 md:col-span-2 md:flex-row md:justify-start">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              حفظ الباقة
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
