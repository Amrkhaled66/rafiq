import { View } from "react-native";

import { homeChecklistKeys } from "@/features/home/constants/checklist";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { ScreenShell } from "@/shared/ui/screen-shell";
import { ThemedText } from "@/shared/ui/themed-text";

export function HomeScreen() {
  const { t } = useI18n();

  return (
    <ScreenShell
      eyebrow={t("home.eyebrow")}
      title={t("home.title")}
      description={t("home.description")}
      contentClassName="gap-4"
    >
      <View className="gap-3 pt-1">
        <ThemedText type="eyebrow">{t("home.brand")}</ThemedText>
        <ThemedText type="subtitle">{t("home.priorities")}</ThemedText>
        {homeChecklistKeys.map((item) => (
          <View
            key={item}
            className="flex-row items-start gap-3 rounded-2xl bg-brand-primary-soft/40 px-4 py-4"
          >
            <View className="mt-2 h-2 w-2 rounded-full bg-brand-primary" />
            <ThemedText className="flex-1">{t(item)}</ThemedText>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}
