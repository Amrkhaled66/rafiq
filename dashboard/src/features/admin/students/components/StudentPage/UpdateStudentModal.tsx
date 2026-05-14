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
import { Controller, useForm } from "react-hook-form";
import {
  updateStudentSchema,
  type UpdateStudentFormValues,
} from "@/features/admin/students/schema/updateStudentSchema";
import { useUpdateStudentMutation } from "@/features/admin/students/queries/studentQueries";
import type { Student } from "@/features/admin/students/services/studentService";
import Button from "@/shared/components/Button";
import DropDownMenu from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";
import Modal from "@/shared/components/Modal";
import { EGYPT_CITIES } from "@/shared/const/cities";
import { STUDENT_GRADES } from "@/shared/const/grades";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

type UpdateStudentModalProps = {
  student: Student;
  children: ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
};

export default function UpdateStudentModal({
  student,
  children,
}: UpdateStudentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateStudentMutation = useUpdateStudentMutation(student.id);

  const defaultValues = useMemo<UpdateStudentFormValues>(
    () => ({
      fullName: student.fullName,
      phone: student.phone,
      city: student.city,
      parentPhone: student.parentPhone,
      gradeLevel: student.gradeLevel,
      password: "",
    }),
    [student],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    reset(defaultValues);
    updateStudentMutation.reset();
  }, [defaultValues, reset, updateStudentMutation]);

  const onSubmit = useCallback(
    (values: UpdateStudentFormValues) => {
      updateStudentMutation.mutate(values, {
        onSuccess: () => {
          closeModal();
        },
        onError: (error) => {
          setError("root.serverError", {
            type: "server",
            message: getErrorMessage(error, "تعذر تحديث بيانات الطالب حالياً"),
          });
        },
      });
    },
    [closeModal, setError, updateStudentMutation],
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
        <div className="dashboard-card mx-auto max-w-3xl space-y-6 rounded-3xl p-6 md:p-8">
          <div className="text-start">
            <h2 className="text-foreground text-2xl font-bold">
              تعديل بيانات الطالب
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 text-start md:grid-cols-2"
          >
            <FormInput
              label="اسم الطالب"
              placeholder="اكتب اسم الطالب"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <FormInput
              label="رقم هاتف الطالب"
              type="tel"
              placeholder="01xxxxxxxxx"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <FormInput
              label="رقم هاتف ولي الأمر"
              type="tel"
              placeholder="01xxxxxxxxx"
              error={errors.parentPhone?.message}
              {...register("parentPhone")}
            />
            <FormInput
              label="كلمة المرور"
              type="password"
              placeholder="اكتب كلمة المرور"
              error={errors.password?.message}
              {...register("password")}
            />

            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <DropDownMenu
                  label="المحافظة"
                  value={field.value}
                  error={errors.city?.message}
                  placeholder="اختر المحافظة"
                  items={EGYPT_CITIES.map((city) => ({
                    label: city.label,
                    value: city.key,
                  }))}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="gradeLevel"
              render={({ field }) => (
                <DropDownMenu
                  label="الصف الدراسي"
                  value={field.value}
                  error={errors.gradeLevel?.message}
                  placeholder="اختر الصف الدراسي"
                  items={Object.entries(STUDENT_GRADES).map(([key, label]) => ({
                    label,
                    value: key,
                  }))}
                  onChange={field.onChange}
                />
              )}
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
                isLoading={updateStudentMutation.isPending}
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
