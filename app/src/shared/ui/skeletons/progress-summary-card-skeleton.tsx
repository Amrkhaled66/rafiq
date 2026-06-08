import { View, useWindowDimensions } from "react-native";

import { ShimmerBlock } from "@/shared/ui/skeletons/shimmer-block";
import { SkeletonSurface } from "@/shared/ui/skeletons/skeleton-surface";

type ProgressSummaryCardSkeletonProps = {
  summaryItemsCount?: number;
};

export function ProgressSummaryCardSkeleton({
  summaryItemsCount = 3,
}: ProgressSummaryCardSkeletonProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="overflow-hidden px-4 py-4 md:px-6 md:py-6">
      <View className="gap-3 md:gap-5">
        <View className="flex-row-reverse items-center justify-between gap-3 md:gap-5">
          <View className="flex-1 items-end gap-2 md:gap-3">
            <View className="flex-row-reverse items-center gap-2 md:gap-3">
              <ShimmerBlock
                width={isTablet ? 48 : 36}
                height={isTablet ? 48 : 36}
                borderRadius={18}
              />
              <ShimmerBlock
                width={isTablet ? 210 : 128}
                height={isTablet ? 30 : 20}
                borderRadius={999}
              />
            </View>

            <ShimmerBlock
              width={isTablet ? 280 : 170}
              height={isTablet ? 22 : 15}
              borderRadius={999}
            />
          </View>

          <ShimmerBlock
            width={isTablet ? 92 : 64}
            height={isTablet ? 52 : 36}
            borderRadius={999}
          />
        </View>

        <ShimmerBlock
          width={999}
          height={isTablet ? 14 : 10}
          borderRadius={999}
          style={{ width: "100%" }}
        />

        <View className="flex-row-reverse justify-between gap-2 md:gap-4">
          {Array.from({ length: summaryItemsCount }).map((_, index) => (
            <View key={index} className="flex-1 items-center gap-1 md:gap-2">
              <View className="flex-row-reverse items-center gap-1.5 md:gap-2">
                <ShimmerBlock
                  width={isTablet ? 20 : 16}
                  height={isTablet ? 20 : 16}
                  borderRadius={999}
                />
                <ShimmerBlock
                  width={isTablet ? 22 : 16}
                  height={isTablet ? 22 : 16}
                  borderRadius={999}
                />
              </View>

              <ShimmerBlock
                width={isTablet ? 104 : 64}
                height={isTablet ? 18 : 12}
                borderRadius={999}
              />
            </View>
          ))}
        </View>
      </View>
    </SkeletonSurface>
  );
}
