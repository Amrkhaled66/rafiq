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
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    value: "system",
    label: "حسب إعدادات الجهاز",
    description: "يتغير تلقائيًا مع مظهر هاتفك",
    icon: "phone-portrait-outline",
  },
  {
    value: "light",
    label: "فاتح",
    description: "استخدام المظهر الفاتح دائمًا",
    icon: "sunny-outline",
  },
  {
    value: "dark",
    label: "داكن",
    description: "استخدام المظهر الداكن دائمًا",
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

        <View className="rounded-t-4xl bg-card px-5 pb-8 pt-4">
          <View className="mb-4 items-center">
            <View className="h-1.5 w-14 rounded-full bg-card-border" />
          </View>

          <View className="mb-5 gap-1">
            <AppText className="text-xl" weight="bold" align="center">
              مظهر التطبيق
            </AppText>
            <AppText className="text-sm" tone="muted" weight="medium" align="center">
              اختر المظهر الأنسب لك
            </AppText>
          </View>

          <View className="gap-3">
            {OPTIONS.map((option) => {
              const isSelected = option.value === preference;

              return (
                <Pressable
                  key={option.value}
                  className={`items-center gap-3 rounded-2xl border px-4 py-4 active:opacity-85 ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary-soft"
                      : "border-card-border bg-surface-elevated"
                  } ${dir.rowReverse}`}
                  onPress={() => void selectPreference(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary-soft">
                    <Ionicons name={option.icon} size={21} color={colors.tint} />
                  </View>

                  <View className="flex-1 gap-0.5">
                    <AppText className="text-base" weight="bold">
                      {option.label}
                    </AppText>
                    <AppText className="text-xs" tone="muted" weight="medium">
                      {option.description}
                    </AppText>
                  </View>

                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                    size={23}
                    color={isSelected ? colors.tint : colors.icon}
                  />
                </Pressable>
              );
            })}
          </View>

          <Pressable
            className="mt-6 rounded-2xl bg-brand-primary py-3.5 active:opacity-90"
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
