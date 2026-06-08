import { View, useWindowDimensions } from "react-native";

import { ShimmerBlock } from "@/shared/ui/skeletons/shimmer-block";
import { SkeletonSurface } from "@/shared/ui/skeletons/skeleton-surface";

type SegmentedFilterTabsSkeletonProps = {
  itemsCount?: number;
};

export function SegmentedFilterTabsSkeleton({
  itemsCount = 4,
}: SegmentedFilterTabsSkeletonProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-2xl px-1 py-1 md:px-1.5 md:py-1.5">
      <View className="flex-row-reverse gap-1 md:gap-1.5">
        {Array.from({ length: itemsCount }).map((_, index) => (
          <View key={index} className="flex-1">
            <ShimmerBlock
              width={isTablet ? 108 : 72}
              height={isTablet ? 54 : 40}
              borderRadius={18}
              style={{ width: "100%" }}
            />
          </View>
        ))}
      </View>
    </SkeletonSurface>
  );
}
