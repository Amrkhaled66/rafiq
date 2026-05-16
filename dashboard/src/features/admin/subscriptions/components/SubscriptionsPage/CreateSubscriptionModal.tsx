import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";

import type { SubscriptionPackage } from "@/features/admin/subscriptions/services/subscriptionService";
import {
  subscriptionSchema,
  type SubscriptionFormInput,
  type SubscriptionFormValues,
} from "@/features/admin/subscriptions/schema/subscriptionSchema";
import Button from "@/shared/components/Button";
import DropDownMenu from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";
import { formatDateLocal, formatDateArShort } from "@/shared/utils/dates";

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() + days);
  return utcDate.toISOString().slice(0, 10);
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  packages,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubscriptionFormValues) => void;
  isSubmitting?: boolean;
  packages: SubscriptionPackage[];
}) {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormInput, undefined, SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      studentPhone: "",
      packageId: 0,
      startsAt: formatDateLocal(new Date()),
      amountPaid: 0,
    },
  });

  const selectedPackageId = useWatch({ control, name: "packageId" });
  const startsAt = useWatch({ control, name: "startsAt" });
  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === Number(selectedPackageId)),
    [packages, selectedPackageId],
  );

  const endsAtPreview = useMemo(() => {
    if (!selectedPackage || !startsAt) {
      return "-";
    }

    return addDays(startsAt, selectedPackage.durationDays - 1);
  }, [selectedPackage, startsAt]);

  useEffect(() => {
    if (selectedPackage) {
      setValue("amountPaid", selectedPackage.price, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [selectedPackage, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        studentPhone: "",
        packageId: 0,
        startsAt: formatDateLocal(new Date()),
        amountPaid: 0,
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-2xl space-y-6 overflow-visible rounded-3xl p-6 md:p-8">
        <div className="text-right">
          <h2 className="text-foreground text-2xl font-bold">إضافة اشتراك جديد</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 overflow-visible text-right md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <FormInput
              label="رقم هاتف الطالب"
              placeholder="اكتب رقم هاتف الطالب"
              error={errors.studentPhone?.message}
              {...register("studentPhone")}
            />
          </div>

          <Controller
            control={control}
            name="packageId"
            render={({ field }) => (
              <DropDownMenu
                label="الباقة"
                value={field.value ? String(field.value) : ""}
                error={errors.packageId?.message}
                placeholder="اختر الباقة"
                items={packages.map((item) => ({
                  label: `${item.name} - ${item.price} ج.م`,
                  value: String(item.id),
                }))}
                onChange={(value) => field.onChange(Number(value))}
              />
            )}
          />

          <FormInput
            label="تاريخ البداية"
            type="date"
            error={errors.startsAt?.message}
            {...register("startsAt")}
          />

          <FormInput
            label="المبلغ المدفوع"
            type="number"
            min={0}
            error={errors.amountPaid?.message}
            {...register("amountPaid", { valueAsNumber: true })}
          />

          <div className="rounded-2xl bg-brand-primary-soft px-4 py-3 text-right md:col-span-2">
            <p className="text-sm font-medium text-brand-primary">
              تاريخ الانتهاء:{" "}
              {endsAtPreview === "-" ? "-" : formatDateArShort(endsAtPreview)}
            </p>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 md:col-span-2 md:flex-row md:justify-start">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              حفظ الاشتراك
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
