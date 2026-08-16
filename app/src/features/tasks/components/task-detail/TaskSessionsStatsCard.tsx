import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { TaskSessionsStatsCardSkeleton } from "@/features/tasks/components/task-detail/skeletons";
import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

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
  textColor: string;
  mutedTextColor: string;
  shadowColor: string;
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
  textColor,
  mutedTextColor,
  shadowColor,
}: MiniStatCardProps) {
  return (
    <View
      className="flex-1 rounded-3xl border px-4 py-1 md:px-5 md:py-2"
      style={{
        backgroundColor: bgColor,
        borderColor,
        shadowColor,
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
            style={{ color: mutedTextColor }}
          >
            {label}
          </AppText>

          <View className="flex-row-reverse items-baseline gap-1">
            <AppText
              className="text-right text-[28px] md:text-[30px]"
              weight="bold"
              style={{ color: textColor }}
            >
              {value}
            </AppText>

            {unit ? (
              <AppText
                className="text-right text-xs md:text-[13px]"
                weight="semibold"
                style={{ color: mutedTextColor }}
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
  const { effectiveColorScheme, colors } = useAppTheme();
  const isDark = effectiveColorScheme === "dark";
  const statsColors = {
    focusBg: isDark ? "#153424" : "#EFFAF0",
    focusBorder: isDark ? "#27603F" : "#CDEFD1",
    focusIconBg: isDark ? "#1B482F" : "#D9F5DD",
    focusIcon: isDark ? "#62D98A" : "#21A447",
    sessionsBg: isDark ? "#301D3D" : "#F7EEFF",
    sessionsBorder: isDark ? "#54336D" : "#E4CCFF",
    sessionsIconBg: isDark ? "#422655" : "#EAD7FF",
    sessionsIcon: isDark ? "#C69AF4" : "#8B35D8",
  };

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
        bgColor={statsColors.focusBg}
        borderColor={statsColors.focusBorder}
        iconBgColor={statsColors.focusIconBg}
        iconColor={statsColors.focusIcon}
        textColor={colors.text}
        mutedTextColor={colors.mutedText}
        shadowColor={colors.shadow}
      />

      <MiniStatCard
        icon="telescope-outline"
        value={completedSessions}
        label="جلسات مكتملة"
        bgColor={statsColors.sessionsBg}
        borderColor={statsColors.sessionsBorder}
        iconBgColor={statsColors.sessionsIconBg}
        iconColor={statsColors.sessionsIcon}
        textColor={colors.text}
        mutedTextColor={colors.mutedText}
        shadowColor={colors.shadow}
      />
    </View>
  );
}
