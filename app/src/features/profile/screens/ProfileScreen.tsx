import { router } from "expo-router";
import { Pressable, View } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { ScreenShell } from "@/shared/ui/screen-shell";
import { ThemedText } from "@/shared/ui/themed-text";
import { useAuth } from "@/features/auth/context/AuthProvider";
export function ProfileScreen() {
  const { language, setLanguage, t } = useI18n();
  const { logout } = useAuth();
  
  return (
    <ScreenShell
      eyebrow={t("profile.eyebrow")}
      title={t("profile.title")}
      description={t("profile.description")}
      contentClassName="gap-4"
    >
      <View className="gap-3 pt-2">
        <View className="rounded-2xl border border-card-border bg-card px-4 py-4">
          <ThemedText type="defaultSemiBold">{t("profile.summary")}</ThemedText>
          <ThemedText className="mt-1 text-sub-title">
            {t("profile.placeholder")}
          </ThemedText>
        </View>

        <View className="gap-2 rounded-2xl border border-card-border bg-card px-4 py-4">
          <ThemedText type="defaultSemiBold">{t("profile.language")}</ThemedText>
          <View className="flex-row gap-2">
            <Pressable
              className={`rounded-2xl px-4 py-3 ${language === "en" ? "bg-brand-primary" : "bg-brand-primary-soft"}`}
              onPress={() => void setLanguage("en")}
            >
              <ThemedText
                className={language === "en" ? "text-white" : "text-brand-primary"}
                type="defaultSemiBold"
              >
                {t("profile.english")}
              </ThemedText>
            </Pressable>
            <Pressable
              className={`rounded-2xl px-4 py-3 ${language === "ar" ? "bg-brand-primary" : "bg-brand-primary-soft"}`}
              onPress={() => void setLanguage("ar")}
            >
              <ThemedText
                className={language === "ar" ? "text-white" : "text-brand-primary"}
                type="defaultSemiBold"
              >
                {t("profile.arabic")}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <Pressable
          className="self-start rounded-2xl bg-brand-primary-soft px-4 py-3 active:bg-brand-primary-muted"
          onPress={logout}
        >
          <ThemedText type="defaultSemiBold">{t("profile.logout")}</ThemedText>
        </Pressable>
      </View>
    </ScreenShell>
  );
}
