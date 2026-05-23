import { View } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { ScreenShell } from "@/shared/ui/screen-shell";
import { ThemedText } from "@/shared/ui/themed-text";

const taskSectionKeys = ["tasks.section1", "tasks.section2", "tasks.section3"] as const;

export function MyTasksScreen() {
  const { t } = useI18n();

  return (
    <ScreenShell
      eyebrow={t("tasks.eyebrow")}
      title={t("tasks.title")}
      description={t("tasks.description")}
      contentClassName="gap-4"
    >
      <View className="gap-3 pt-2">
        {taskSectionKeys.map((item, index) => (
          <View
            key={item}
            className="rounded-2xl border border-card-border bg-card px-4 py-4"
          >
            <ThemedText className="mb-1 text-brand-primary" type="eyebrow">
              0{index + 1}
            </ThemedText>
            <ThemedText type="defaultSemiBold">{t(item)}</ThemedText>
            <ThemedText className="mt-1 text-sub-title">
              {t("tasks.placeholder")}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}
