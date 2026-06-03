import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { Colors } from "@/shared/theme/theme";
import { AppCaption, AppHeading, AppText } from "@/shared/ui/app-text";
import { ElevatedView } from "@/shared/ui/elevated-view";

type TodaySummaryCardProps = {
  tasksCount: number;
  lessonsCount: number;
};

type StatCardProps = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View className="flex-1 rounded-[22px] bg-[#faf7f6] px-4 py-4">
      <View className="mb-3 flex-row-reverse items-center justify-between">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-primary-soft">
          <Ionicons name={icon} size={20} color={Colors.light.tint} />
        </View>
        <AppText className="text-[28px] leading-8" tone="tint" weight="bold">
          {value}
        </AppText>
      </View>
      <AppCaption className="text-right text-sm">{label}</AppCaption>
    </View>
  );
}

export function TodaySummaryCard({
  tasksCount,
  lessonsCount,
}: TodaySummaryCardProps) {
  return (
    <ElevatedView className="rounded-[28px] bg-white px-5 py-5">
      <View className="gap-4">
        <View className="items-end gap-1">
          <AppHeading className="text-right text-xl">ملخص اليوم</AppHeading>
          <AppCaption className="text-right text-sm leading-6">
            عندك مهام ودروس لازم تخلصهم النهاردة
          </AppCaption>
        </View>

        <View className="flex-row-reverse gap-3">
          <StatCard
            label="مهام اليوم"
            value={tasksCount}
            icon="checkmark-done-outline"
          />
          <StatCard
            label="دروس اليوم"
            value={lessonsCount}
            icon="book-outline"
          />
        </View>
      </View>
    </ElevatedView>
  );
}
