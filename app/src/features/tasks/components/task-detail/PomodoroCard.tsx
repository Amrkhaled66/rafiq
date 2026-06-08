import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

import timerPanner from "@assets/images/timer-banner.png";
import { CircularTimer } from "@/features/tasks/components/task-detail/CircularTimer";
import { PomodoroCardSkeleton } from "@/features/tasks/components/task-detail/skeletons";
import type { TaskDetailStatus } from "@/features/tasks/types";
import { AppText } from "@/shared/ui/app-text";

type PomodoroCardProps = {
  taskTitle: string;
  taskStatus: TaskDetailStatus;
  soundEnabled: boolean;
  pomodoroState: "idle" | "running" | "paused";
  durationSeconds: number;
  remainingSeconds: number;
  progress: number;
  currentSession?: number;
  totalSessions?: number;
  onToggleSound: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
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
  pomodoroState,
  durationSeconds,
  remainingSeconds,
  progress,
  onStart,
  onPause,
  onResume,
  onStop,
  isLoading = false,
}: PomodoroCardProps) {
  if (isLoading) {
    return <PomodoroCardSkeleton />;
  }

  const isTaskCompleted = taskStatus === "completed";

  const ctaAppearance = (() => {
    if (isTaskCompleted) {
      return {
        label: "مكتملة",
        icon: "checkmark" as const,
        disabled: true,
        onPress: onStart,
      };
    }

    if (pomodoroState === "running") {
      return {
        label: "إيقاف مؤقت",
        icon: "pause" as const,
        disabled: false,
        onPress: onPause,
      };
    }

    if (pomodoroState === "paused") {
      return {
        label: "كمل الجلسة",
        icon: "play" as const,
        disabled: false,
        onPress: onResume,
      };
    }

    return {
      label: "ابدأ الجلسة",
      icon: "play" as const,
      disabled: false,
      onPress: onStart,
    };
  })();

  return (
    <View
      className="border-card-border relative overflow-hidden rounded-3xl border bg-[#FFFDFB] px-5 py-4 md:px-6 md:py-10"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <Image
        source={timerPanner}
        resizeMode="contain"
        className="absolute top-3 left-4 h-18 w-18 md:top-4 md:left-5 md:size-28"
      />

      <View className="absolute top-6 right-5 md:top-7 md:right-6">
        <AppText className="text-lg text-[#FFC83D]! md:text-3xl">✦</AppText>
      </View>
      <View className="absolute top-4 right-9 md:top-4 md:right-10">
        <AppText className="text-xs text-[#FFC83D]! md:text-xl">✧</AppText>
      </View>
      <View className="absolute top-10 right-7 md:top-12 md:right-8">
        <AppText className="text-xs text-[#FFC83D]! md:text-xl">✧</AppText>
      </View>

      <AppText
        className="absolute top-63 left-6 rotate-[-25deg] text-[40px] md:top-[286px] md:left-7 md:text-[66px]"
        style={{ color: CARD_COLORS.purple }}
      >
        ↝
      </AppText>

      <AppText
        className="absolute top-60.5 right-8 rotate-25 text-[40px] md:top-69.5 md:right-9 md:text-[66px]"
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
                ? "#D1D5DB"
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

          {pomodoroState !== "idle" && !isTaskCompleted ? (
            <Pressable
              className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border bg-white active:opacity-80 md:h-13 md:gap-2.5"
              style={{ borderColor: CARD_COLORS.red }}
              onPress={onStop}
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
          ) : null}
        </View>
      </View>
    </View>
  );
}
