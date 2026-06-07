import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";

import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type FloatingCompleteTaskButtonProps = {
  disabled?: boolean;
  onConfirm: () => void;
};

const PALETTE = {
  brand: Colors.light.tint,
  brandSoft: Colors.light.soft,
  brandMuted: "#EFA9AB",
  white: "#FFFFFF",
  textPrimary: Colors.light.text,
  textMuted: Colors.light.icon,
  border: Colors.light.border,
  success: "#16A34A",
};

export function FloatingCompleteTaskButton({
  disabled = false,
  onConfirm,
}: FloatingCompleteTaskButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const openConfirm = () => {
    if (disabled) return;

    setIsConfirming(true);
    contentOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(shellProgress, {
        toValue: 1,
        useNativeDriver: false,
        tension: 70,
        friction: 14,
      }),

      Animated.sequence([
        Animated.delay(90),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const closeConfirm = () => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),

      Animated.timing(shellProgress, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsConfirming(false);
      }
    });
  };

  const confirmAndClose = () => {
    onConfirm();
    closeConfirm();
  };

  const width = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [126, 332],
  });

  const height = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 136],
  });

  const borderRadius = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [999, 28],
  });

  const collapsedOpacity = shellProgress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  const collapsedScale = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
    extrapolate: "clamp",
  });

  const confirmTranslateY = contentOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
    extrapolate: "clamp",
  });

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        right: 18,
        left: 18,
        bottom: 20,
        zIndex: 60,
        alignItems: "flex-end",
      }}
    >
      <Animated.View
        style={{
          width,
          height,
          borderRadius,
          overflow: "hidden",
          backgroundColor: PALETTE.white,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        {/* Collapsed button */}
        <Animated.View
          pointerEvents={isConfirming ? "none" : "auto"}
          style={{
            position: "absolute",
            inset: 0,
            opacity: collapsedOpacity,
            transform: [{ scale: collapsedScale }],
          }}
        >
          <Pressable
            disabled={disabled}
            onPress={openConfirm}
            className="h-full w-full flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-90"
            style={{
              backgroundColor: disabled ? "#D1D5DB" : PALETTE.brand,
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color={PALETTE.white} />

            <AppText className="text-base" tone="inverse" weight="bold">
              خلصت؟
            </AppText>
          </Pressable>
        </Animated.View>

        {/* Confirmation content */}
        <Animated.View
          pointerEvents={isConfirming ? "auto" : "none"}
          style={{
            position: "absolute",
            inset: 0,
            opacity: contentOpacity,
            transform: [{ translateY: confirmTranslateY }],
          }}
        >
          <View
            className="h-full w-full border px-4 py-3.5"
            style={{
              backgroundColor: PALETTE.white,
              borderColor: PALETTE.border,
            }}
          >
            <View className="mb-3 flex-row-reverse items-center gap-2.5">
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: PALETTE.brandSoft }}
              >
                <Ionicons name="checkmark" size={18} color={PALETTE.success} />
              </View>

              <View className="flex-1 items-end">
                <AppText
                  className="text-right text-[15px]"
                  weight="bold"
                  style={{ color: PALETTE.textPrimary }}
                >
                  متأكد إنك خلصته؟
                </AppText>

                <AppText
                  className="mt-0.5 text-right text-[11px]"
                  weight="medium"
                  style={{ color: PALETTE.textMuted }}
                >
                  هنعلم المهمة كمكتملة في الخطة
                </AppText>
              </View>
            </View>

            <View className="flex-row-reverse gap-2">
              <Pressable
                onPress={confirmAndClose}
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-90"
                style={{ backgroundColor: PALETTE.brand }}
              >
                <AppText className="text-sm" tone="inverse" weight="bold">
                  أيوه خلصت
                </AppText>
              </Pressable>

              <Pressable
                onPress={closeConfirm}
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full border px-5 active:opacity-90"
                style={{
                  backgroundColor: PALETTE.white,
                  borderColor: PALETTE.brandMuted,
                }}
              >
                <AppText
                  className="text-sm"
                  tone="tint"
                  weight="bold"
                  style={{ color: PALETTE.brand }}
                >
                  لسه
                </AppText>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
