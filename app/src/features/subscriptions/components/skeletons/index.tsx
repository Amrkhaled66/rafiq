import { View, useWindowDimensions } from "react-native";

import {
  SegmentedFilterTabsSkeleton,
  ShimmerBlock,
  SkeletonSurface,
} from "@/shared/ui/skeletons";

export function SubscriptionFilterTabsSkeleton() {
  return <SegmentedFilterTabsSkeleton itemsCount={5} />;
}

export function SubscriptionSectionSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="flex-row-reverse items-center justify-between">
      <ShimmerBlock
        width={isTablet ? 136 : 116}
        height={isTablet ? 28 : 24}
        borderRadius={999}
      />

      <ShimmerBlock
        width={isTablet ? 96 : 82}
        height={isTablet ? 26 : 22}
        borderRadius={999}
      />
    </View>
  );
}

export function SubscriptionCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-3xl px-4 py-4">
      <View className="flex-row-reverse items-start gap-3">
        <ShimmerBlock
          width={56}
          height={56}
          borderRadius={16}
        />

        <View className="flex-1 items-end gap-2">
          <View className="flex-row-reverse items-center justify-between gap-2 self-stretch">
            <ShimmerBlock
              width={isTablet ? 190 : 154}
              height={isTablet ? 24 : 20}
              borderRadius={999}
            />

            <ShimmerBlock
              width={isTablet ? 74 : 62}
              height={isTablet ? 22 : 20}
              borderRadius={999}
            />
          </View>

          <ShimmerBlock
            width={isTablet ? 170 : 136}
            height={isTablet ? 18 : 15}
            borderRadius={999}
          />

          <View className="flex-row-reverse items-center gap-2 self-end">
            <ShimmerBlock
              width={16}
              height={16}
              borderRadius={999}
            />
            <ShimmerBlock
              width={isTablet ? 98 : 86}
              height={isTablet ? 18 : 15}
              borderRadius={999}
            />
          </View>
        </View>
      </View>
    </SkeletonSurface>
  );
}
