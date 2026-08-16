import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View } from "react-native";

import LoginForm from "@/features/auth/components/LoginForm";
import LoginHeader from "@/features/auth/components/LoginHeader";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";
import { KeyboardScreenView } from "@/shared/ui/keyboard-screen-view";
import { AppModal } from "@/shared/ui/app-modal";

export function LoginScreen() {
  const { language } = useI18n();
  const { user } = useAuth();
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  return (
    <View className="flex-1 bg-background">
      <FocusedStatusBar style="light" />
      <LoginHeader />
      <KeyboardScreenView>
        <LoginForm
          language={language}
          onSubmit={() => router.replace("/home")}
          onSubscriptionRequired={() =>
            setIsSubscriptionModalVisible(true)
          }
        />
      </KeyboardScreenView>

      <AppModal
        visible={isSubscriptionModalVisible}
        title="لا يوجد اشتراك فعال"
        message="اشتراكك غير فعال أو انتهى. تواصل مع الدعم لتجديد الاشتراك، و تسجيل الدخول تاني."
        actionLabel="حسنًا"
        onClose={() => setIsSubscriptionModalVisible(false)}
      />
    </View>
  );
}
