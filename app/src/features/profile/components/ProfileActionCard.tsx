import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { ProfileActionCardSkeleton } from "@/features/profile/components/skeletons";
import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type ProfileActionCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isLoading?: boolean;
  value?: string;
};

export function ProfileActionCard({
  title,
  icon,
  onPress,
  isLoading = false,
  value,
}: ProfileActionCardProps) {
  const { colors } = useAppTheme();

  if (isLoading) {
    return <ProfileActionCardSkeleton />;
  }

  return (
    <Pressable
      className="border-card-border bg-card rounded-3xl border px-4 py-4 active:opacity-90"
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="items-center gap-3 flex-row">
        <View className="bg-brand-primary-soft h-11 w-11 items-center justify-center rounded-2xl">
          <Ionicons name={icon} size={20} color={colors.tint} />
        </View>

        {value ? (
          <AppText className="text-xs md:text-sm" tone="muted" weight="medium">
            {value}
          </AppText>
        ) : null}

        <View className="flex-1">
          <AppText className="text-base md:text-lg" weight="semibold">
            {title}
          </AppText>
        </View>

        <View>
          <Ionicons
            name="chevron-back"
            size={18}
            className="text-brand-primary"
          />
        </View>
      </View>
    </Pressable>
  );
}
