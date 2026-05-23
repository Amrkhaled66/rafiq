import { View } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { ScreenShell } from "@/shared/ui/screen-shell";
import { ThemedText } from "@/shared/ui/themed-text";

export function PlansScreen() {
  const { t } = useI18n();

  return (
    <ScreenShell
      eyebrow={t("plans.eyebrow")}
      title={t("plans.title")}
      description={t("plans.description")}
      contentClassName="gap-4"
    >
      <View className="pt-2">
        <View className="gap-2 rounded-2xl border border-card-border bg-card px-4 py-4">
          <ThemedText type="subtitle">{t("plans.currentPlan")}</ThemedText>
          <ThemedText className="text-sub-title">
            {t("plans.placeholder")}
          </ThemedText>
        </View>
      </View>
    </ScreenShell>
  );
}
