import { View } from "react-native";

import { PlanStatCard } from "@/features/plans/components/PlanStatCard";

type PlanDetailStatsProps = {
  totalDays: number;
  totalTasks: number;
  progressPercentage: number;
};

export function PlanDetailStats({
  totalDays,
  totalTasks,
  progressPercentage,
}: PlanDetailStatsProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      <PlanStatCard
        title="إجمالي الأيام"
        value={String(totalDays)}
        subtitle="أيام في هذه الخطة"
        icon="calendar-outline"
        backgroundColor="#FFF1F2"
        borderColor="#FFD5D9"
        iconBackgroundColor="#FEE2E2"
        iconColor="#D00507"
      />
      <PlanStatCard
        title="إجمالي المهام"
        value={String(totalTasks)}
        subtitle="مهمة في هذه الخطة"
        icon="checkmark-done-outline"
        backgroundColor="#EFF6FF"
        borderColor="#BFDBFE"
        iconBackgroundColor="#DBEAFE"
        iconColor="#2563EB"
      />
      <PlanStatCard
        title="نسبة التقدم"
        value={`${progressPercentage}%`}
        subtitle="من الخطة مكتملة"
        icon="bar-chart-outline"
        backgroundColor="#F0FDF4"
        borderColor="#BBF7D0"
        iconBackgroundColor="#DCFCE7"
        iconColor="#16A34A"
      />
    </View>
  );
}
