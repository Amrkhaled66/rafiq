import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEventHandler,
  type ReactElement,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { CoachProfile } from "@/features/admin/coaches/services/coachService";
import {
  updateCoachSchema,
  type UpdateCoachFormValues,
} from "@/features/admin/coaches/schema/updateCoachSchema";
import { useUpdateCoachMutation } from "@/features/admin/coaches/queries/coachQueries";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

type UpdateCoachInfoModalProps = {
  coach: CoachProfile;
  children: ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
};

export default function UpdateCoachInfoModal({
  coach,
  children,
}: UpdateCoachInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateCoachMutation = useUpdateCoachMutation(coach.id);

  const defaultValues = useMemo<UpdateCoachFormValues>(
    () => ({
      fullName: coach.fullName,
      phone: coach.phone,
      password: "",
    }),
    [coach.fullName, coach.id, coach.phone],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateCoachFormValues>({
    resolver: zodResolver(updateCoachSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    reset(defaultValues);
    updateCoachMutation.reset();
  }, [defaultValues, reset, updateCoachMutation]);

  const onSubmit = useCallback(
    (values: UpdateCoachFormValues) => {
      updateCoachMutation.mutate(values, {
        onSuccess: () => {
          closeModal();
        },
        onError: (error) => {
          setError("root.serverError", {
            type: "server",
            message: getErrorMessage(error, "تعذر تحديث بيانات المدرب حالياً"),
          });
        },
      });
    },
    [closeModal, setError, updateCoachMutation],
  );

  const trigger = cloneElement(children, {
    onClick: () => {
      setIsOpen(true);
    },
  });

  return (
    <>
      {trigger}

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="dashboard-card mx-auto max-w-2xl space-y-6 rounded-3xl p-6 md:p-8">
          <div className="text-start">
            <h2 className="text-foreground text-2xl font-bold">
              تعديل بيانات المدرب
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 text-start md:grid-cols-2"
          >
            <FormInput
              label="اسم المدرب"
              placeholder="اكتب اسم المدرب"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <FormInput
              label="رقم الهاتف"
              type="tel"
              placeholder="01xxxxxxxxx"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <div className="md:col-span-2">
              <FormInput
                label="كلمة المرور الجديدة"
                type="password"
                placeholder="اتركها فارغة إذا كنت لا تريد تغييرها"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            {errors.root?.serverError?.message ? (
              <p className="text-right text-sm text-red-500 md:col-span-2">
                {errors.root.serverError.message}
              </p>
            ) : null}

            <div className="mt-2 flex flex-col-reverse gap-3 md:col-span-2 md:flex-row md:justify-start">
              <Button
                type="button"
                variant="outline"
                className="min-w-28"
                onClick={closeModal}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="min-w-36"
                isLoading={updateCoachMutation.isPending}
              >
                حفظ التعديلات
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
