import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type SupportSectionCardProps = {
  onSupportPress: () => void;
  onLogoutPress: () => void;
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
  const dir = useDirection();

  return (
    <Pressable
      className={`px-4 py-4 active:opacity-90 ${!isLast ? "border-card-border border-b" : ""}`}
      onPress={onPress}
    >
      <View className={`items-center gap-3 ${dir.rowReverse}`}>
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
          name={dir.isRTL ? "chevron-back" : "chevron-forward"}
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
}: SupportSectionCardProps) {
  return (
    <View
      className="border-card-border bg-card overflow-hidden rounded-[26px] border"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <SupportRow
        title="تواصل مع الدعم"
        icon="headset-outline"
        iconColor={Colors.light.tint}
        backgroundColor={Colors.light.soft}
        onPress={onSupportPress}
      />
      <SupportRow
        title="تسجيل الخروج"
        icon="log-out-outline"
        iconColor={Colors.light.tint}
        backgroundColor="#FDECEC"
        // textTone="tint"
        isLast
        onPress={onLogoutPress}
      />
    </View>
  );
}
