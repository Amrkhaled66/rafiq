import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

import timerPanner from "@assets/images/timer-banner.webp";
import { CircularTimer } from "@/features/tasks/components/task-detail/CircularTimer";
import { PomodoroCardSkeleton } from "@/features/tasks/components/task-detail/skeletons";
import type { TaskDetailStatus } from "@/features/tasks/types";
import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type PomodoroCardProps = {
  taskStatus: TaskDetailStatus;
  state: "idle" | "running" | "paused";
  durationSeconds: number;
  remainingSeconds: number;
  progress: number;
  isTransitioning: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const CARD_COLORS = {
  red: "#EF233C",
  yellow: "#FFC83D",
  green: "#8FD694",
  purple: "#C9A7FF",
};

export function PomodoroCard({
  taskStatus,
  state,
  durationSeconds,
  remainingSeconds,
  progress,
  isTransitioning,
  onStart,
  onPause,
  onResume,
  onCancel,
  isLoading = false,
}: PomodoroCardProps) {
  const { colors } = useAppTheme();

  if (isLoading) {
    return <PomodoroCardSkeleton />;
  }

  const isTaskCompleted = taskStatus === "completed";
  const showStopButton = state !== "idle" && !isTaskCompleted;

  const ctaAppearance = (() => {
    if (isTaskCompleted) {
      return {
        label: "مكتملة",
        icon: "checkmark" as const,
        disabled: true,
        onPress: onStart,
      };
    }

    if (state === "running") {
      return {
        label: "إيقاف مؤقت",
        icon: "pause" as const,
        disabled: isTransitioning,
        onPress: onPause,
      };
    }

    if (state === "paused") {
      return {
        label: "كمل الجلسة",
        icon: "play" as const,
        disabled: isTransitioning,
        onPress: onResume,
      };
    }

    return {
      label: "ابدأ الجلسة",
      icon: "play" as const,
      disabled: isTransitioning,
      onPress: onStart,
    };
  })();

  return (
    <View
      className="border-card-border relative h-fit overflow-hidden rounded-3xl border bg-card px-5 py-4 md:px-6 md:py-10"
      style={{
        shadowColor: colors.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <Image
        source={timerPanner}
        resizeMode="contain"
        className="absolute top-3 inset-e-4 h-18 w-18 md:top-4 md:inset-e-5 md:size-28"
      />

      <View className="absolute top-6 inset-s-5 md:top-7 md:inset-s-6">
        <AppText className="text-lg text-[#FFC83D]! md:text-3xl">✦</AppText>
      </View>
      <View className="absolute top-4 inset-s-9 md:top-4 md:inset-s-10">
        <AppText className="text-xs text-[#FFC83D]! md:text-xl">✧</AppText>
      </View>
      <View className="absolute top-10 inset-s-7 md:top-12 md:inset-s-8">
        <AppText className="text-xs text-[#FFC83D]! md:text-xl">✧</AppText>
      </View>

      <AppText
        className="absolute top-63 inset-e-6 rotate-[-25deg] text-[40px] md:top-71.5 md:inset-e-7 md:text-[66px]"
        style={{ color: CARD_COLORS.purple }}
      >
        ↝
      </AppText>

      <AppText
        className="absolute top-60.5 inset-s-8 rotate-25 text-[40px] md:top-69.5 md:inset-s-9 md:text-[66px]"
        style={{ color: CARD_COLORS.green }}
      >
        ↜
      </AppText>

      <View className="items-center gap-5 md:gap-6">
        <View className="items-center">
          <CircularTimer
            durationSeconds={durationSeconds}
            remainingSeconds={remainingSeconds}
            progress={progress}
          />
        </View>

        <View className="mt-4 w-[82%] gap-3 md:mt-5 md:w-[60%] md:gap-3.5">
          <Pressable
            className="h-14 flex-row items-center justify-center gap-2 rounded-2xl active:opacity-90 md:h-15 md:gap-2.5"
            disabled={ctaAppearance.disabled}
            onPress={ctaAppearance.onPress}
            style={{
              backgroundColor: ctaAppearance.disabled
                ? colors.disabled
                : CARD_COLORS.red,
            }}
          >
            <Ionicons name={ctaAppearance.icon} size={21} color="#FFFFFF" />

            <AppText
              className="text-base md:text-[17px]"
              tone="inverse"
              weight="bold"
            >
              {ctaAppearance.label}
            </AppText>
          </Pressable>

          <Pressable
            className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border bg-card active:opacity-80 md:h-13 md:gap-2.5"
            style={{
              borderColor: CARD_COLORS.red,
              opacity: showStopButton ? 1 : 0,
            }}
            disabled={!showStopButton || isTransitioning}
            onPress={onCancel}
          >
            <View
              className="h-3.5 w-3.5 rounded-[4px] md:h-4 md:w-4"
              style={{ backgroundColor: CARD_COLORS.red }}
            />

            <AppText
              className="text-sm md:text-[15px]"
              weight="bold"
              style={{ color: CARD_COLORS.red }}
            >
              إنهاء الجلسة
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
