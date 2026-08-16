import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";

type PageDateBadgeProps = {
  dateLabel: string;
};

export function PageDateBadge({ dateLabel }: PageDateBadgeProps) {
  const { colors } = useAppTheme();

  return (
    <View className="mx-auto mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-card px-4 py-2.5 shadow">
      <Ionicons
        name="calendar-outline"
        size={18}
        color={colors.tint}
      />

      <AppText className="text-sm md:text-base" tone="muted" weight="semibold">
        {dateLabel}
      </AppText>
    </View>
  );
}
