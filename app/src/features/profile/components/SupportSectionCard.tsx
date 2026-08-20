import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { SupportSectionCardSkeleton } from "@/features/profile/components/skeletons";
import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";

type SupportSectionCardProps = {
  onSupportPress: () => void;
  onLogoutPress: () => void;
  isLoading?: boolean;
};

type SupportRowProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  textTone?: "default" | "tint";
  isLast?: boolean;
  onPress: () => void;
};

function SupportRow({
  title,
  icon,
  iconColor,
  backgroundColor,
  textTone = "default",
  isLast = false,
  onPress,
}: SupportRowProps) {

  return (
    <Pressable
      className={`px-4 py-4 active:opacity-90 ${!isLast ? "border-card-border border-b" : ""}`}
      onPress={onPress}
    >
      <View className="items-center gap-3 flex-row">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>

        <View className="flex-1">
          <AppText
            className="text-base md:text-lg"
            tone={textTone}
            weight="semibold"
          >
            {title}
          </AppText>
        </View>

        <Ionicons
          name="chevron-back"
          size={18}
          className="text-brand-primary"
        />
      </View>
    </Pressable>
  );
}

export function SupportSectionCard({
  onSupportPress,
  onLogoutPress,
  isLoading = false,
}: SupportSectionCardProps) {
  const { colors } = useAppTheme();

  if (isLoading) {
    return <SupportSectionCardSkeleton />;
  }

  return (
    <View
      className="border-card-border bg-card overflow-hidden rounded-[26px] border"
      style={{
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <SupportRow
        title="تواصل مع الدعم"
        icon="headset-outline"
        iconColor={colors.tint}
        backgroundColor={colors.soft}
        onPress={onSupportPress}
      />
      <SupportRow
        title="تسجيل الخروج"
        icon="log-out-outline"
        iconColor={colors.tint}
        backgroundColor={colors.soft}
        // textTone="tint"
        isLast
        onPress={onLogoutPress}
      />
    </View>
  );
}
