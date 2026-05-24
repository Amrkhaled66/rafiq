import { router } from "expo-router";
import { View } from "react-native";

import LoginForm from "@/features/auth/components/LoginForm";
import LoginHeader from "@/features/auth/components/LoginHeader";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { KeyboardScreenView } from "@/shared/ui/keyboard-screen-view";

export function LoginScreen() {
  const { language } = useI18n();

  return (
    <View className="flex-1 bg-white">
      <LoginHeader />
      <KeyboardScreenView>
        <LoginForm language={language} onSubmit={() => router.push("/home")} />
      </KeyboardScreenView>
    </View>
  );
}
