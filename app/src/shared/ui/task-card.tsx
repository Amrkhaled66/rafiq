import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";

type TaskCardProps = {
  title: string;
  subject: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor: string;
  iconColor: string;
  statusLabel: string;
  statusBackgroundColor: string;
  statusTextColor: string;
  onPress?: () => void;
};

export function TaskCard({
  title,
  subject,
  icon,
  iconBackgroundColor,
  iconColor,
  statusLabel,
  statusBackgroundColor,
  statusTextColor,
  onPress,
}: TaskCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="rounded-3xl border border-card-border bg-card px-4 py-3.5 md:px-5 md:py-4 active:opacity-90"
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="items-start gap-3 md:gap-3.5 flex-row">
        <View
          className="size-14 md:size-15 items-center justify-center rounded-2xl"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Ionicons name={icon} size={26} color={iconColor} />
        </View>

        <View className="flex-1 gap-2 md:gap-2.5 items-start">
          <AppText
            className="text-base md:text-[19px] "
            weight="bold"
            numberOfLines={1}
          >
            {title}
          </AppText>

          <View className="items-center gap-1 flex-row">
            <View className="size-1 rounded-full bg-brand-primary" />
            <AppText
              className="text-sm md:text-[15px]"
              tone="muted"
              weight="medium"
            >
              {subject}
            </AppText>

            <View
              className="rounded-full px-3 py-1 md:px-3.5 md:py-1.5"
              style={{ backgroundColor: statusBackgroundColor }}
            >
              <AppText
                className="text-[11px] md:text-[13px]"
                weight="semibold"
                style={{ color: statusTextColor }}
              >
                {statusLabel}
              </AppText>
            </View>
          </View>
        </View>

        <View className="size-9 md:size-10 items-center justify-center rounded-full bg-input">
          <Ionicons
            name="chevron-back"
            size={19}
            color={colors.icon}
          />
        </View>
      </View>
    </Pressable>
  );
}
