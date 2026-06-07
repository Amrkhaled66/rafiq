import { Text, View, useWindowDimensions } from "react-native";

import { HomePageSection } from "@/features/home/components/HomePageSection";
import { ProgressRing } from "@/features/home/components/ProgressRing";
import { ProgressSkeleton } from "@/features/home/components/skeletons";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppHeading, AppText } from "@/shared/ui/app-text";

type ProgressProps = {
  progress: number;
  completedCount: number;
  totalCount: number;
  isLoading?: boolean;
};

export function Progress({
  progress,
  completedCount,
  totalCount,
  isLoading = false,
}: ProgressProps) {
  const { width } = useWindowDimensions();
  const dir = useDirection();
  const isTablet = width >= 768;
  const remainingCount = Math.max(totalCount - completedCount, 0);

  if (isLoading) {
    return <ProgressSkeleton />;
  }

  return (
    <HomePageSection
      title="تقدمك النهاردة"
      icon="sparkles-outline"
      contentClassName="gap-0"
      className="rounded-[28px] bg-white px-4 pt-4 md:px-7 md:py-6"
    >
      <View className={`items-center justify-between ${dir.rowReverse}`}>
        <View className="flex-1 gap-3">
          <View className="gap-1">
            <AppHeading className="text-right text-xl md:text-[26px]">
              خلصت <Text className="text-brand-primary">{completedCount} </Text>
              من
              <Text className="text-brand-primary"> {totalCount} </Text>
              مهام
            </AppHeading>

            <AppText
              className="text-right text-sm md:text-lg"
              tone="muted"
              weight="regular"
            >
              فاضل {remainingCount} مهمات
            </AppText>
          </View>
        </View>

        <ProgressRing
          progress={progress}
          label="إنجاز اليوم"
          size={isTablet ? 140 : 110}
          strokeWidth={isTablet ? 14 : 12}
        />
      </View>
    </HomePageSection>
  );
}
