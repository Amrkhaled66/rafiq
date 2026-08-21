import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";

export type LessonWatchState =
  | "scheduled"
  | "watched"
  | "missed"
  | "watched_late"
  | "future";

export type LessonWatchItem = {
  id: number;
  title: string;
  subject: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor: string;
  iconColor: string;
  state: LessonWatchState;
};

type LessonWatchRowProps = {
  lesson: LessonWatchItem;
  isLast?: boolean;
  trailingMode?: "checkbox" | "status";
  onPress?: (lessonId: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export function LessonWatchRow({
  lesson,
  isLast = false,
  trailingMode = "checkbox",
  onPress,
  disabled = false,
  isLoading = false,
}: LessonWatchRowProps) {
  const { colors, effectiveColorScheme } = useAppTheme();
  const isChecked =
    lesson.state === "watched" || lesson.state === "watched_late";
  const isDisabled = disabled || isLoading || !onPress;
  const statusAppearance = {
    watched_late: {
      label: "شوهدت متأخرًا",
      background: effectiveColorScheme === "dark" ? "#17344A" : "#E0F2FE",
      color: effectiveColorScheme === "dark" ? "#7DD3FC" : "#0369A1",
    },
    missed: {
      label: "فاتت - شاهد الآن",
      background: effectiveColorScheme === "dark" ? "#4A1D20" : "#FEE2E2",
      color: effectiveColorScheme === "dark" ? "#FCA5A5" : "#DC2626",
    },
    watched: {
      label: "تمت المشاهدة",
      background: effectiveColorScheme === "dark" ? "#143A27" : "#DCFCE7",
      color: effectiveColorScheme === "dark" ? "#86EFAC" : "#166534",
    },
    future: {
      label: "قادمة",
      background: colors.input,
      color: colors.mutedText,
    },
    scheduled: {
      label: "شاهد الحصة",
      background: colors.soft,
      color: colors.tint,
    },
  }[lesson.state];

  return (
    <Pressable
      className={`bg-card px-4 py-4 active:opacity-90 md:px-5 md:py-4.5 ${
        trailingMode === "status"
          ? "border-card-border rounded-3xl border"
          : `rounded-[24px] ${!isLast ? "border-b border-b-card-border" : ""}`
      }`}
      disabled={isDisabled}
      onPress={() => onPress?.(lesson.id)}
      accessibilityRole={trailingMode === "checkbox" ? "checkbox" : "button"}
      accessibilityState={{
        disabled: isDisabled,
        checked: trailingMode === "checkbox" ? isChecked : undefined,
      }}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <View className="flex-row items-center gap-3 md:gap-3.5">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl md:h-12 md:w-12"
          style={{ backgroundColor: lesson.iconBackgroundColor }}
        >
          <Ionicons name={lesson.icon} size={21} color={lesson.iconColor} />
        </View>

        <View className="flex-1 items-start gap-1">
          <AppText
            className="text-base md:text-[18px]"
            weight="semibold"
            numberOfLines={1}
          >
            {lesson.title}
          </AppText>
          <AppText className="text-sm" tone="muted" weight="medium">
            {lesson.subject}
          </AppText>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.tint} />
        ) : trailingMode === "status" ? (
          <View
            className="max-w-32 rounded-full px-3 py-1.5"
            style={{ backgroundColor: statusAppearance.background }}
          >
            <AppText
              className="text-[11px]"
              weight="semibold"
              align="center"
              style={{ color: statusAppearance.color }}
            >
              {statusAppearance.label}
            </AppText>
          </View>
        ) : (
          <View
            className="h-7 w-7 items-center justify-center rounded-lg border md:h-8 md:w-8"
            style={{
              backgroundColor: isChecked ? colors.tint : colors.card,
              borderColor: isChecked ? colors.tint : colors.disabled,
            }}
          >
            {isChecked ? (
              <Ionicons name="checkmark" size={17} color="#FFFFFF" />
            ) : null}
          </View>
        )}
      </View>
    </Pressable>
  );
}
