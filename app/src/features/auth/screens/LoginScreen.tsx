import { router } from "expo-router";
import { View } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";

import LoginHeader from "@/features/auth/components/LoginHeader";
import LoginForm from "@/features/auth/components/LoginForm";

export function LoginScreen() {
  const { language } = useI18n();

  return (
    <View className="h-screen sm:gap-0 gap-8 bg-white">
      <LoginHeader />
      <LoginForm language={language} onSubmit={() => router.push("/home")} />
    </View>
  );
}
