import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type FloatingCompleteTaskButtonProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  onConfirm: () => Promise<boolean>;
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
  isSubmitting = false,
  onConfirm,
}: FloatingCompleteTaskButtonProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [isConfirming, setIsConfirming] = useState(false);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const collapsedWidth = isTablet ? 148 : 126;
  const expandedWidth = isTablet ? 388 : 332;
  const collapsedHeight = isTablet ? 62 : 56;
  const expandedHeight = isTablet ? 154 : 136;
  const collapsedRadius = 999;
  const expandedRadius = isTablet ? 32 : 28;

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

  const confirmAndClose = async () => {
    if (isSubmitting) return;

    const succeeded = await onConfirm();

    if (succeeded) {
      closeConfirm();
    }
  };

  const widthAnimated = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedWidth, expandedWidth],
  });

  const heightAnimated = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedHeight, expandedHeight],
  });

  const borderRadius = shellProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedRadius, expandedRadius],
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
        right: isTablet ? 28 : 18,
        left: isTablet ? 28 : 18,
        bottom: isTablet ? 28 : 20,
        zIndex: 60,
        alignItems: "flex-end",
      }}
    >
      <Animated.View
        style={{
          width: widthAnimated,
          height: heightAnimated,
          borderRadius,
          overflow: "hidden",
          backgroundColor: PALETTE.white,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 1,
        }}
      >
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
            className="h-full w-full flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-90 md:gap-2.5 md:px-6"
            style={{
              backgroundColor: disabled ? "#D1D5DB" : PALETTE.brand,
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={isTablet ? 22 : 20}
              color={PALETTE.white}
            />

            <AppText
              className="text-base md:text-[17px]"
              tone="inverse"
              weight="bold"
            >
              خلصت؟
            </AppText>
          </Pressable>
        </Animated.View>

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
            className="h-full w-full items-center justify-center border px-4 py-3.5 md:px-5"
            style={{
              backgroundColor: PALETTE.white,
              borderColor: PALETTE.border,
            }}
          >
            <View className="mb-3 flex-row-reverse items-center gap-2.5 md:gap-3">
              <View
                className="size-9 items-center justify-center rounded-full md:size-14"
                style={{ backgroundColor: PALETTE.brandSoft }}
              >
                <Ionicons
                  name="checkmark"
                  size={isTablet ? 30 : 18}
                  color={PALETTE.textMuted}
                />
              </View>

              <View className="flex-1 items-end">
                <AppText
                  className="text-right text-[15px] md:text-xl"
                  weight="bold"
                  style={{ color: PALETTE.textPrimary }}
                >
                  متأكد إنك خلصته؟
                </AppText>

                <AppText
                  className="mt-0.5 text-right text-[11px] md:text-base"
                  weight="medium"
                  style={{ color: PALETTE.textMuted }}
                >
                  هنعلم المهمة كمكتملة في الخطة
                </AppText>
              </View>
            </View>

            <View className="flex-row-reverse gap-2 md:gap-2.5">
              <Pressable
                disabled={isSubmitting}
                onPress={() => void confirmAndClose()}
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-90 md:h-12 md:px-6"
                style={{
                  backgroundColor: PALETTE.brand,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting && (
                  <ActivityIndicator size="small" color={PALETTE.white} />
                )}
                <AppText
                  className="text-sm md:text-[15px]"
                  tone="inverse"
                  weight="bold"
                >
                  أيوه خلصت
                </AppText>
              </Pressable>

              <Pressable
                disabled={isSubmitting}
                onPress={closeConfirm}
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full border px-5 active:opacity-90 md:h-12 md:px-6"
                style={{
                  backgroundColor: PALETTE.white,
                  borderColor: PALETTE.brandMuted,
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                <AppText
                  className="text-sm md:text-[15px]"
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
