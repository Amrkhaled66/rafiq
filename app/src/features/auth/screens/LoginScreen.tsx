import { useEffect } from "react";
import { router } from "expo-router";
import { View } from "react-native";

import LoginForm from "@/features/auth/components/LoginForm";
import LoginHeader from "@/features/auth/components/LoginHeader";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";
import { KeyboardScreenView } from "@/shared/ui/keyboard-screen-view";

export function LoginScreen() {
  const { language } = useI18n();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  return (
    <View className="flex-1 bg-white">
      <FocusedStatusBar style="light" />
      <LoginHeader />
      <KeyboardScreenView>
        <LoginForm
          language={language}
          onSubmit={() => router.replace("/home")}
        />
      </KeyboardScreenView>
    </View>
  );
}
