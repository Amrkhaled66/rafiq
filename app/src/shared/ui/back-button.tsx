import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const dir = useDirection();

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
        name={dir.isRTL ? "chevron-back" : "chevron-forward"}
        size={22}
        color={Colors.light.tint}
      />
    </Pressable>
  );
}
