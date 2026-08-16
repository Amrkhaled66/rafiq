import { View } from "react-native";

import { PlanDetailStatsSkeleton } from "@/features/plans/components/skeletons";
import { PlanStatCard } from "@/features/plans/components/PlanStatCard";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type PlanDetailStatsProps = {
  totalDays: number;
  totalTasks: number;
  progressPercentage: number;
  isLoading?: boolean;
};

export function PlanDetailStats({
  totalDays,
  totalTasks,
  progressPercentage,
  isLoading = false,
}: PlanDetailStatsProps) {
  const { effectiveColorScheme } = useAppTheme();
  const isDark = effectiveColorScheme === "dark";

  if (isLoading) {
    return <PlanDetailStatsSkeleton />;
  }

  return (
    <View className="flex-row flex-wrap gap-3 md:gap-4">
      <PlanStatCard
        title="إجمالي الأيام"
        value={String(totalDays)}
        subtitle="أيام في هذه الخطة"
        icon="calendar-outline"
        backgroundColor={isDark ? "#3D1719" : "#FFF1F2"}
        borderColor={isDark ? "#692528" : "#FFD5D9"}
        iconBackgroundColor={isDark ? "#521D20" : "#FEE2E2"}
        iconColor={isDark ? "#FF9C9E" : "#D00507"}
      />
      <PlanStatCard
        title="إجمالي المهام"
        value={String(totalTasks)}
        subtitle="مهمة في هذه الخطة"
        icon="checkmark-done-outline"
        backgroundColor={isDark ? "#17283D" : "#EFF6FF"}
        borderColor={isDark ? "#284A71" : "#BFDBFE"}
        iconBackgroundColor={isDark ? "#1E3857" : "#DBEAFE"}
        iconColor={isDark ? "#7DB5FF" : "#2563EB"}
      />
      <PlanStatCard
        title="نسبة التقدم"
        value={`${progressPercentage}%`}
        subtitle="من الخطة مكتملة"
        icon="bar-chart-outline"
        backgroundColor={isDark ? "#153424" : "#F0FDF4"}
        borderColor={isDark ? "#27603F" : "#BBF7D0"}
        iconBackgroundColor={isDark ? "#1B482F" : "#DCFCE7"}
        iconColor={isDark ? "#62D98A" : "#16A34A"}
      />
    </View>
  );
}
