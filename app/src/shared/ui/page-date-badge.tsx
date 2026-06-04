import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type PageDateBadgeProps = {
  dateLabel: string;
};

export function PageDateBadge({ dateLabel }: PageDateBadgeProps) {
  return (
    <View className="mx-auto mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow">
      <Ionicons
        name="calendar-outline"
        size={18}
        color={Colors.light.tint}
      />

      <AppText className="text-sm md:text-base" tone="muted" weight="semibold">
        {dateLabel}
      </AppText>
    </View>
  );
}
