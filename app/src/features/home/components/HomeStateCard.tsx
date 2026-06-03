import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, useWindowDimensions } from "react-native";

import { Colors } from "@/shared/theme/theme";
import { AppCaption, AppHeading, AppText } from "@/shared/ui/app-text";
import { ElevatedView } from "@/shared/ui/elevated-view";

type HomeStateCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function HomeStateCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: HomeStateCardProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <ElevatedView
      className="rounded-[28px] bg-white"
      style={{
        paddingHorizontal: isTablet ? 28 : 20,
        paddingVertical: isTablet ? 24 : 20,
      }}
    >
      <View className="items-end gap-4">
        <View
          className="items-center justify-center rounded-full bg-brand-primary-soft"
          style={{
            height: isTablet ? 56 : 48,
            width: isTablet ? 56 : 48,
          }}
        >
          <Ionicons
            name={icon}
            size={isTablet ? 26 : 22}
            color={Colors.light.tint}
          />
        </View>

        <View className="items-end gap-1 self-stretch">
          <AppHeading className="text-right text-lg leading-7 md:text-2xl md:leading-[34px]">
            {title}
          </AppHeading>
          <AppCaption className="text-right leading-6 md:leading-7">
            {description}
          </AppCaption>
        </View>

        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            className="self-end rounded-2xl bg-brand-primary"
            style={{
              paddingHorizontal: isTablet ? 24 : 20,
              paddingVertical: isTablet ? 14 : 12,
            }}
          >
            <AppText
              className="text-sm md:text-[15px]"
              tone="inverse"
              weight="bold"
            >
              {actionLabel}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </ElevatedView>
  );
}
