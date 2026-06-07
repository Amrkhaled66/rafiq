import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

import { CircularTimer } from "@/features/tasks/components/task-detail/CircularTimer";
import type { TaskDetailStatus } from "@/features/tasks/types";
import { AppText } from "@/shared/ui/app-text";

import timerPanner from "@assets/images/timer-banner.png";

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
};

const CARD_COLORS = {
  title: "#321334",
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
}: PomodoroCardProps) {
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
      className="border-card-border relative overflow-hidden rounded-3xl border bg-[#FFFDFB] px-5 py-4"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <Image
        source={timerPanner}
        resizeMode="contain"
        className="absolute top-3 left-4 size-18"
      />
      <View className="absolute top-6 right-5">
        <AppText className="text-lg text-[#FFC83D]!">✦</AppText>
      </View>
      <View className="absolute top-4 right-9">
        <AppText className="text-xs text-[#FFC83D]!">✧</AppText>
      </View>
      <View className="absolute top-10 right-7">
        <AppText className="text-xs text-[#FFC83D]!">✧</AppText>
      </View>

      <AppText
        className="absolute top-62.5 left-6 rotate-[-25deg] text-5xl"
        style={{ color: CARD_COLORS.purple }}
      >
        ↝
      </AppText>

      <AppText
        className="absolute top-60 right-8 rotate-25 text-5xl"
        style={{ color: CARD_COLORS.green }}
      >
        ↜
      </AppText>

      <View className="items-center gap-5">
        <View className="items-center">
          <CircularTimer
            durationSeconds={durationSeconds}
            remainingSeconds={remainingSeconds}
            progress={progress}
          />
        </View>

        <View className="mt-5 w-[80%] gap-3">
          <Pressable
            className="h-14 flex-row items-center justify-center gap-2 rounded-2xl active:opacity-90"
            disabled={ctaAppearance.disabled}
            onPress={ctaAppearance.onPress}
            style={{
              backgroundColor: ctaAppearance.disabled
                ? "#D1D5DB"
                : CARD_COLORS.red,
            }}
          >
            <Ionicons name={ctaAppearance.icon} size={20} color="#FFFFFF" />

            <AppText className="text-base" tone="inverse" weight="bold">
              {ctaAppearance.label}
            </AppText>
          </Pressable>

          {pomodoroState !== "idle" && !isTaskCompleted ? (
            <Pressable
              className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border bg-white active:opacity-80"
              style={{ borderColor: CARD_COLORS.red }}
              onPress={onStop}
            >
              <View
                className="h-3.5 w-3.5 rounded-[4px]"
                style={{ backgroundColor: CARD_COLORS.red }}
              />

              <AppText
                className="text-sm"
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
