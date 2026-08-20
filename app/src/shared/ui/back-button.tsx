import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-soft active:opacity-80"
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }

        router.back();
      }}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color={colors.tint}
      />
    </Pressable>
  );
}
