import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import type { PlanDetailLesson } from "@/features/plans/types";
import { getTodayCairoDateString } from "@/features/plans/utils/plan-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";
import { getSubjectUi } from "@/shared/utils/subject-ui";

export function PlanLessonCard({
  lesson,
  date,
  isLoading,
  onPress,
}: {
  lesson: PlanDetailLesson;
  date: string;
  isLoading: boolean;
  onPress: () => void;
}) {
  const dir = useDirection();
  const { colors, effectiveColorScheme } = useAppTheme();
  const subject = getSubjectUi(lesson.subject);
  const today = getTodayCairoDateString();
  const isFuture = date > today;
  const canPress = !isFuture && lesson.status !== "watched_late";
  const appearance =
    lesson.status === "watched_late"
      ? {
          label: "شوهدت متأخرًا",
          background: effectiveColorScheme === "dark" ? "#17344A" : "#E0F2FE",
          color: effectiveColorScheme === "dark" ? "#7DD3FC" : "#0369A1",
        }
      : lesson.status === "missed"
        ? {
            label: "فاتت - شاهد الآن",
            background: effectiveColorScheme === "dark" ? "#4A1D20" : "#FEE2E2",
            color: effectiveColorScheme === "dark" ? "#FCA5A5" : "#DC2626",
          }
        : lesson.status === "watched_on_time"
          ? {
              label: "تمت المشاهدة",
              background:
                effectiveColorScheme === "dark" ? "#143A27" : "#DCFCE7",
              color: effectiveColorScheme === "dark" ? "#86EFAC" : "#166534",
            }
          : isFuture
            ? {
                label: "قادمة",
                background: colors.input,
                color: colors.mutedText,
              }
            : {
                label: "شاهد الحصة",
                background: colors.soft,
                color: colors.tint,
              };

  return (
    <Pressable
      disabled={!canPress || isLoading}
      onPress={onPress}
      className="border-card-border bg-card rounded-3xl border px-4 py-3.5 active:opacity-90"
      style={{ opacity: isLoading ? 0.65 : 1 }}
    >
      <View className={`items-center gap-3 ${dir.rowReverse}`}>
        <View
          className="size-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: subject.iconBackgroundColor }}
        >
          <Ionicons name={subject.icon} size={25} color={subject.iconColor} />
        </View>
        <View className={`flex-1 gap-1.5 ${dir.itemsAlign}`}>
          <AppText
            className={`text-base ${dir.textAlign}`}
            weight="bold"
            numberOfLines={1}
          >
            {lesson.name}
          </AppText>
          <AppText className="text-sm" tone="muted" weight="medium">
            {subject.label}
          </AppText>
        </View>
        {isLoading ? (
          <ActivityIndicator color={colors.tint} />
        ) : (
          <View
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: appearance.background }}
          >
            <AppText
              className="text-[11px]"
              weight="semibold"
              style={{ color: appearance.color }}
            >
              {appearance.label}
            </AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
}
