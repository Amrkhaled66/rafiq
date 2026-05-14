import {
  cloneElement,
  useCallback,
  useState,
  type MouseEventHandler,
  type ReactElement,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import {
  addCoachSchema,
  type AddCoachFormValues,
} from "@/features/admin/coaches/schema/addCoachSchema";
import { useCreateCoachMutation } from "@/features/admin/coaches/queries/coachQueries";

type AddCoachModalProps = {
  children: ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
};

export default function AddCoachModal({ children }: AddCoachModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createCoachMutation = useCreateCoachMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddCoachFormValues>({
    resolver: zodResolver(addCoachSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
    },
  });

  const closeModal = useCallback(() => {
    setIsOpen(false);
    reset();
    createCoachMutation.reset();
  }, [createCoachMutation, reset]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onSubmit = useCallback(
    (values: AddCoachFormValues) => {
      createCoachMutation.mutate(values, {
        onSuccess: () => {
          closeModal();
        },
        onError: (error) => {
          setError("root.serverError", {
            type: "server",
            message: getErrorMessage(error, "تعذر إضافة المدرب حالياً"),
          });
        },
      });
    },
    [closeModal, createCoachMutation, setError],
  );

  const trigger = cloneElement(children, {
    onClick: () => {
      openModal();
    },
  });

  return (
    <>
      {trigger}

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="dashboard-card mx-auto max-w-2xl space-y-6 rounded-3xl p-6 md:p-8">
          <div className="text-start">
            <h2 className="text-foreground text-2xl font-bold">إضافة مدرب جديد</h2>
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

            <FormInput
              label="كلمة المرور"
              type="password"
              placeholder="اكتب كلمة المرور"
              error={errors.password?.message}
              {...register("password")}
            />

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
                isLoading={createCoachMutation.isPending}
              >
                حفظ المدرب
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
