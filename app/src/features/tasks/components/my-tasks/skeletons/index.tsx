import { View, useWindowDimensions } from "react-native";

import {
  SegmentedFilterTabsSkeleton,
  ShimmerBlock,
  SkeletonSurface,
} from "@/shared/ui/skeletons";

export function TaskStatusFilterTabsSkeleton() {
  return <SegmentedFilterTabsSkeleton itemsCount={4} />;
}

export function TaskSectionSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="gap-2.5 md:gap-4">
      {[0, 1, 2].map((item) => (
        <SkeletonSurface
          key={item}
          className="rounded-3xl px-4 py-3.5 md:px-6 md:py-5"
        >
          <View className="flex-row-reverse items-start gap-3 md:gap-4.5">
            <ShimmerBlock
              width={isTablet ? 72 : 56}
              height={isTablet ? 72 : 56}
              borderRadius={20}
            />

            <View className="flex-1 items-end gap-2 md:gap-3">
              <ShimmerBlock
                width={isTablet ? 250 : 148}
                height={isTablet ? 30 : 20}
                borderRadius={999}
              />

              <View className="flex-row-reverse items-center gap-2 md:gap-2.5">
                <ShimmerBlock
                  width={isTablet ? 88 : 56}
                  height={isTablet ? 16 : 10}
                  borderRadius={999}
                />
                <ShimmerBlock
                  width={isTablet ? 74 : 48}
                  height={isTablet ? 26 : 20}
                  borderRadius={999}
                />
              </View>
            </View>

            <ShimmerBlock
              width={isTablet ? 46 : 36}
              height={isTablet ? 46 : 36}
              borderRadius={999}
            />
          </View>
        </SkeletonSurface>
      ))}
    </View>
  );
}
