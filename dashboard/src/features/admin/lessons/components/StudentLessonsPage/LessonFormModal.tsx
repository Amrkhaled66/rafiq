import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import {
  lessonSchema,
  type LessonFormValues,
} from "@/features/admin/lessons/schema/lessonSchema";
import Button from "@/shared/components/Button";
import DropDownMenu from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";
import { SCHOOL_SUBJECT_OPTIONS } from "@/shared/const/subjects";

type LessonFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormValues) => void;
  isSubmitting?: boolean;
  title: string;
  submitLabel: string;
  lesson?: Lesson | null;
  serverError?: string | null;
};

export default function LessonFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  title,
  submitLabel,
  lesson,
  serverError,
}: LessonFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      subject: lesson?.subject ?? "",
      scheduledAt: lesson?.scheduledAt ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: lesson?.name ?? "",
      subject: lesson?.subject ?? "",
      scheduledAt: lesson?.scheduledAt ?? "",
    });
  }, [lesson, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-2xl space-y-6 rounded-3xl p-6 md:p-8">
        <div className="text-right">
          <h2 className="text-foreground text-2xl font-bold">{title}</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 text-right md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <FormInput
              label="اسم الدرس"
              placeholder="اكتب اسم الدرس"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>

          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <DropDownMenu
                label="المادة"
                value={field.value}
                error={errors.subject?.message}
                placeholder="اختر المادة"
                items={SCHOOL_SUBJECT_OPTIONS.map((subject) => ({
                  label: subject.label,
                  value: subject.value,
                }))}
                onChange={field.onChange}
              />
            )}
          />

          <FormInput
            label="تاريخ الدرس"
            type="date"
            error={errors.scheduledAt?.message}
            {...register("scheduledAt")}
          />

          {serverError ? (
            <p className="text-right text-sm text-red-500 md:col-span-2">
              {serverError}
            </p>
          ) : null}

          <div className="mt-2 flex flex-col-reverse gap-3 md:col-span-2 md:flex-row md:justify-start">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

