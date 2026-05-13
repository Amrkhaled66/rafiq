import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/features/admin/layouts/AuthLayout";
import FormInput from "@/shared/components/FormInput";
import { useAuth } from "@/shared/context/authContext";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import {
  signinSchema,
  type SigninFormValues,
} from "@/features/admin/auth/schema/signinSchema";
import { useAdminLoginMutation } from "@/features/admin/auth/queries/authQueries";
import Button from "@/shared/components/Button";
import { urls } from "@/shared/const/urls";

const SigninPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useAdminLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (values: SigninFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: ({ user, token }) => {
        login(user, token);
        navigate(`/${urls.dashBoardUrl}`, { replace: true });
      },
      onError: (error) => {
        setError("phone", {
          type: "server",
          message: getErrorMessage(error, "رقم الهاتف أو كلمة المرور غير صحيحة"),
        });
      },
    });
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5 text-right"
      >
        <FormInput
          label="رقم الهاتف"
          type="tel"
          placeholder="اكتب رقم موبايلك"
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

        <Button
          isLoading={loginMutation.isPending}
          className="mt-2 w-full rounded-2xl py-3 text-base font-bold"
          type="submit"
        >
          تسجيل الدخول
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SigninPage;
