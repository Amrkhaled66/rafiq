import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { TaskSessionsStatsCardSkeleton } from "@/features/tasks/components/task-detail/skeletons";
import { AppText } from "@/shared/ui/app-text";

type TaskSessionsStatsCardProps = {
  totalFocusMinutes: number;
  totalSessions: number;
  completedSessions: number;
  isLoading?: boolean;
};

type MiniStatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  unit?: string;
  label: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
};

const STATS_COLORS = {
  textDark: "#321334",
  textMuted: "#6B5A6E",
  focusBg: "#EFFAF0",
  focusBorder: "#CDEFD1",
  focusIconBg: "#D9F5DD",
  focusIcon: "#21A447",
  sessionsBg: "#F7EEFF",
  sessionsBorder: "#E4CCFF",
  sessionsIconBg: "#EAD7FF",
  sessionsIcon: "#8B35D8",
};

function MiniStatCard({
  icon,
  value,
  unit,
  label,
  bgColor,
  borderColor,
  iconBgColor,
  iconColor,
}: MiniStatCardProps) {
  return (
    <View
      className="flex-1 rounded-3xl border px-4 py-1 md:px-5 md:py-2"
      style={{
        backgroundColor: bgColor,
        borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center justify-between gap-3 md:gap-4">
        <View
          className="h-12 w-12 items-center justify-center rounded-full md:h-13 md:w-13"
          style={{ backgroundColor: iconBgColor }}
        >
          <Ionicons name={icon} size={25} color={iconColor} />
        </View>

        <View className="flex-1 items-end">
          <AppText
            className="text-right text-[13px] md:text-[14px]"
            weight="medium"
            style={{ color: STATS_COLORS.textMuted }}
          >
            {label}
          </AppText>

          <View className="flex-row-reverse items-baseline gap-1">
            <AppText
              className="text-right text-[28px] md:text-[30px]"
              weight="bold"
              style={{ color: STATS_COLORS.textDark }}
            >
              {value}
            </AppText>

            {unit ? (
              <AppText
                className="text-right text-xs md:text-[13px]"
                weight="semibold"
                style={{ color: STATS_COLORS.textMuted }}
              >
                {unit}
              </AppText>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

export function TaskSessionsStatsCard({
  totalFocusMinutes,
  totalSessions,
  completedSessions,
  isLoading = false,
}: TaskSessionsStatsCardProps) {
  if (isLoading) {
    return <TaskSessionsStatsCardSkeleton />;
  }

  return (
    <View className="mb-5 flex-row-reverse gap-3 md:mb-6 md:gap-4">
      <MiniStatCard
        icon="time-outline"
        value={totalFocusMinutes}
        unit="د"
        label="وقت التركيز"
        bgColor={STATS_COLORS.focusBg}
        borderColor={STATS_COLORS.focusBorder}
        iconBgColor={STATS_COLORS.focusIconBg}
        iconColor={STATS_COLORS.focusIcon}
      />

      <MiniStatCard
        icon="telescope-outline"
        value={completedSessions}
        label="جلسات مكتملة"
        bgColor={STATS_COLORS.sessionsBg}
        borderColor={STATS_COLORS.sessionsBorder}
        iconBgColor={STATS_COLORS.sessionsIconBg}
        iconColor={STATS_COLORS.sessionsIcon}
      />
    </View>
  );
}
