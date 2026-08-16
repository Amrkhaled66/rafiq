import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import {
  type ThemePreference,
  useAppTheme,
} from "@/shared/theme/appearance-provider";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type AppearanceSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    value: "system",
    label: "حسب إعدادات الجهاز",
    icon: "phone-portrait-outline",
  },
  {
    value: "light",
    label: "فاتح",
    icon: "sunny-outline",
  },
  {
    value: "dark",
    label: "داكن",
    icon: "moon-outline",
  },
];

export function AppearanceSheet({ visible, onClose }: AppearanceSheetProps) {
  const { colors, preference, setPreference } = useAppTheme();
  const dir = useDirection();

  const selectPreference = async (nextPreference: ThemePreference) => {
    await setPreference(nextPreference);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.overlay }]}
          onPress={onClose}
          accessibilityLabel="إغلاق نافذة المظهر"
        />

        <View className="rounded-t-4xl bg-card px-5 pb-7 pt-3">
          <View className="mb-5 items-center">
            <View className="h-1 w-10 rounded-full bg-divider" />
          </View>

          <View className="mb-6 gap-1">
            <AppText className="text-lg" weight="bold" align="center">
              مظهر التطبيق
            </AppText>
            <AppText className="text-xs" tone="muted" weight="medium" align="center">
              اختر المظهر الأنسب لك
            </AppText>
          </View>

          <View className={`gap-2.5 ${dir.rowReverse}`}>
            {OPTIONS.map((option) => {
              const isSelected = option.value === preference;

              return (
                <Pressable
                  key={option.value}
                  className={`min-h-32 flex-1 items-center justify-center gap-2 rounded-2xl border px-2 py-3 ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary-soft"
                      : "border-card-border bg-surface-elevated"
                  }`}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.72 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                  onPress={() => void selectPreference(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View
                    className={`h-11 w-11 items-center justify-center rounded-full ${
                      isSelected ? "bg-brand-primary" : "bg-brand-primary-soft"
                    }`}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={isSelected ? "#FFFFFF" : colors.tint}
                    />
                  </View>

                  <AppText
                    className="min-h-10 text-xs leading-5"
                    weight={isSelected ? "bold" : "semibold"}
                    align="center"
                    numberOfLines={2}
                  >
                    {option.label}
                  </AppText>

                  <View
                    className={`h-1.5 w-6 rounded-full ${
                      isSelected ? "bg-brand-primary" : "bg-divider"
                    }`}
                  />
                </Pressable>
              );
            })}
          </View>

          <Pressable
            className="mt-5 rounded-2xl bg-brand-primary py-3 active:opacity-85"
            onPress={onClose}
          >
            <AppText tone="inverse" weight="bold" align="center">
              تم
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
