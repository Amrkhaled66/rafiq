import { AxiosError } from "axios";
import { useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import AuthInput from "@/features/auth/components/AuthInput";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useLoginMutation } from "@/features/auth/queries/authQueries";
import type { LoginFormValues } from "@/features/auth/types";
import type { AppLanguage } from "@/shared/i18n/translations";
import { useForm } from "@/shared/hooks/use-form";
import { AppFonts } from "@/shared/theme/theme";

type LoginFormProps = {
  language: AppLanguage;
  onSubmit?: () => void;
};

type LoginErrorResponse = {
  message?: string;
};

function validateLoginForm(values: LoginFormValues) {
  return {
    phone: values.phone.trim() ? undefined : "الرجاء إدخال رقم الهاتف",
    password: values.password ? undefined : "الرجاء إدخال كلمة المرور",
  };
}

export default function LoginForm({ language, onSubmit }: LoginFormProps) {
  const passwordInputRef = useRef<TextInput>(null);
  const { mutateAsync, isPending } = useLoginMutation();
  const auth = useAuth();

  async function submitLogin(values: LoginFormValues) {
    try {
      const data = await mutateAsync({
        phone: values.phone.trim(),
        password: values.password,
      });

      await auth.login(data.user, data.token);
      onSubmit?.();
    } catch (error) {
      const axiosError = error as AxiosError<LoginErrorResponse>;

      form.updateError(
        axiosError.response?.data?.message ??
          axiosError.message ??
          "Invalid credentials",
        "phone",
      );
    }
  }

  const form = useForm<LoginFormValues>({
    initialValues: {
      phone: "",
      password: "",
    },
    validate: validateLoginForm,
    onSubmit: submitLogin,
  });

  const isSubmitDisabled =
    isPending || !form.values.phone.trim() || !form.values.password;

  return (
    <View className="z-100! flex-1 gap-6 rounded-t-4xl bg-white px-4 py-6 sm:gap-8 sm:rounded-t-[40px] sm:px-8 sm:py-8">
      <View>
        <Text
          style={{
            fontFamily: AppFonts[language].bold,
          }}
          className="py-2 text-center text-3xl sm:pt-0 sm:text-4xl"
        >
          جاهز ليوم <Text className="text-brand-primary">جديد ؟</Text>
        </Text>

        <Text
          style={{
            fontFamily: AppFonts[language].bold,
          }}
          className="text-center text-base text-[#6b6b6b] sm:text-lg"
        >
          سجل دخولك وشوف مهامك النهاردة
        </Text>
      </View>

      <View className="gap-4">
        <AuthInput
          label="رقم الهاتف"
          iconName="phone-portrait-outline"
          value={form.values.phone}
          error={form.errors.phone}
          onChangeText={(value) => form.handleChange("phone", value)}
          placeholder="اكتب رقم التليفون"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <PasswordInput
          ref={passwordInputRef}
          label="كلمة المرور"
          value={form.values.password}
          error={form.errors.password}
          onChangeText={(value) => form.handleChange("password", value)}
          placeholder="اكتب كلمة المرور"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => {
            void form.handleSubmit();
          }}
        />
      </View>

      <Pressable
        onPress={() => {
          void form.handleSubmit();
        }}
        disabled={isSubmitDisabled}
        className={`mx-auto w-[86%] max-w-[520px] rounded-xl py-4 sm:w-[68%] sm:py-5 ${
          isSubmitDisabled
            ? "bg-brand-primary/45"
            : "bg-brand-primary active:bg-red-100"
        }`}
      >
        <Text
          style={{
            fontFamily: AppFonts[language].bold,
          }}
          className="text-center text-white"
        >
          {isPending ? "جارٍ..." : "تسجيل الدخول"}
        </Text>
      </Pressable>
    </View>
  );
}
