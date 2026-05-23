import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { AppLanguage } from "@/shared/i18n/translations";
import { AppFonts } from "@/shared/theme/theme";
import { useLoginMutation } from "@/features/auth/queries/authQueries";
import { useAuth } from "@/features/auth/context/AuthProvider";

type LoginFormProps = {
  language: AppLanguage;
  onSubmit?: () => void;
};

export default function LoginForm({ language, onSubmit }: LoginFormProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useLoginMutation();
  const auth = useAuth();

  function handleSubmit() {
    if (!phone || !password) {
      Alert.alert("خطأ", "الرجاء إدخال رقم الهاتف وكلمة المرور");
      return;
    }

    mutate(
      { phone, password },
      {
        onSuccess: (data) => {
          auth.login(data.user, data.token);
          onSubmit?.();
        },
        onError: (err: any) => {
          Alert.alert("Login failed", err?.message ?? "Invalid credentials");
        },
      },
    );
  }

  return (
    <View className="z-10 flex-1 gap-6 py-4">
      <View>
        <Text
          style={{
            fontFamily: AppFonts[language].bold,
          }}
          className="font-cairo py-2 text-center text-3xl sm:py-0"
        >
          جاهز ليوم <Text className="text-brand-primary">جديد ؟</Text>
        </Text>

        <Text
          style={{
            fontFamily: AppFonts[language].bold,
          }}
          className="text-center text-[#6b6b6b]"
        >
          سجل دخولك وشوف مهامك النهاردة
        </Text>
      </View>

      <View className="gap-4">
        {/* Phone Input */}
        <View className="mx-auto w-[80%] flex-row items-center rounded-xl border border-gray-300 px-3 sm:max-w-[50%]">
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={{
              textAlign: language === "ar" ? "right" : "left",
              writingDirection: language === "ar" ? "rtl" : "ltr",
              flex: 1,
            }}
            placeholder="رقم الهاتف"
            className="px-3 py-4 placeholder:text-gray-500"
          />
          <Ionicons
            name="phone-portrait-outline"
            size={20}
            className="text-brand-primary"
          />
        </View>

        {/* Password Input */}
        <View className="mx-auto w-[80%] flex-row items-center rounded-xl border border-gray-300 px-3 sm:max-w-[50%]">
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              textAlign: language === "ar" ? "right" : "left",
              writingDirection: language === "ar" ? "rtl" : "ltr",
              flex: 1,
            }}
            placeholder="كلمة المرور"
            className="px-3 py-4 placeholder:text-gray-500"
          />
          <Ionicons
            className="text-brand-primary"
            name="lock-closed-outline"
            size={20}
          />
        </View>
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={isPending}
        className="bg-brand-primary mx-auto sm:max-w-[50%]  w-[80%] rounded-xl py-4 active:bg-red-100"
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
