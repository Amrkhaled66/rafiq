import { View, useWindowDimensions } from "react-native";

import {
  SegmentedFilterTabsSkeleton,
  ShimmerBlock,
  SkeletonSurface,
} from "@/shared/ui/skeletons";

export function CurrentPlanCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="px-4 py-4 md:px-6 md:py-6">
      <View className="gap-6 md:gap-8">
        <View className="flex-row-reverse items-center justify-between gap-2 md:gap-3">
          <ShimmerBlock
            width={isTablet ? 120 : 80}
            height={isTablet ? 22 : 15}
            borderRadius={999}
          />
          <ShimmerBlock
            width={isTablet ? 92 : 64}
            height={isTablet ? 30 : 22}
            borderRadius={999}
          />
        </View>

        <View className="items-end gap-3 md:gap-4">
          <ShimmerBlock
            width={isTablet ? 320 : 190}
            height={isTablet ? 34 : 24}
            borderRadius={999}
          />
          <ShimmerBlock
            width={isTablet ? 220 : 132}
            height={isTablet ? 22 : 15}
            borderRadius={999}
          />
        </View>

        {/* <View className="self-end">
          <ShimmerBlock
            width={isTablet ? 126 : 108}
            height={isTablet ? 42 : 36}
            borderRadius={20}
          />
        </View> */}
      </View>
    </SkeletonSurface>
  );
}

export function PlanStatusFilterTabsSkeleton() {
  return <SegmentedFilterTabsSkeleton itemsCount={4} />;
}

export function PlanCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-3xl px-4 py-4 md:px-6 md:py-5">
      <View className="flex-row-reverse items-start gap-3 md:gap-4.5">
        <ShimmerBlock
          width={isTablet ? 72 : 56}
          height={isTablet ? 72 : 56}
          borderRadius={20}
        />

        <View className="flex-1 items-end gap-2 md:gap-3">
          <View className="flex-row-reverse items-center justify-between gap-2 self-stretch md:gap-3">
            <ShimmerBlock
              width={isTablet ? 250 : 144}
              height={isTablet ? 30 : 20}
              borderRadius={999}
            />
            <ShimmerBlock
              width={isTablet ? 92 : 60}
              height={isTablet ? 26 : 20}
              borderRadius={999}
            />
          </View>

          <ShimmerBlock
            width={isTablet ? 220 : 126}
            height={isTablet ? 22 : 15}
            borderRadius={999}
          />
        </View>

        <ShimmerBlock
          width={isTablet ? 46 : 36}
          height={isTablet ? 46 : 36}
          borderRadius={999}
        />
      </View>
    </SkeletonSurface>
  );
}

export function PlansSectionSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="gap-3 md:gap-5">
      <View className="flex-row-reverse items-center justify-between">
        <ShimmerBlock
          width={isTablet ? 190 : 126}
          height={isTablet ? 34 : 24}
          borderRadius={999}
        />
        <ShimmerBlock
          width={isTablet ? 92 : 60}
          height={isTablet ? 30 : 22}
          borderRadius={999}
        />
      </View>

      <View className="gap-2.5 md:gap-4">
        {[0, 1, 2].map((item) => (
          <PlanCardSkeleton key={item} />
        ))}
      </View>
    </View>
  );
}

export function PlanDetailHeaderSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="relative items-center gap-2 md:gap-2.5">
      <View className="absolute left-0 top-2 md:top-2.5">
        <ShimmerBlock width={isTablet ? 52 : 44} height={isTablet ? 52 : 44} borderRadius={18} />
      </View>
      <ShimmerBlock
        width={isTablet ? 320 : 190}
        height={isTablet ? 36 : 26}
        borderRadius={999}
      />
      <ShimmerBlock
        width={isTablet ? 230 : 144}
        height={isTablet ? 22 : 15}
        borderRadius={999}
      />
    </View>
  );
}

export function PlanDetailStatsSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-3 md:gap-5">
      {[0, 1, 2].map((item) => (
        <SkeletonSurface
          key={item}
          className="min-w-[31%] flex-1 rounded-3xl px-4 py-4 md:px-6 md:py-6"
        >
          <View className="items-center gap-3 md:gap-4.5">
            <ShimmerBlock
              width={64}
              height={64}
              borderRadius={20}
            />
            <View className="items-center gap-1.5 md:gap-2">
              <ShimmerBlock width={120} height={20} borderRadius={999} />
              <ShimmerBlock width={74} height={40} borderRadius={999} />
            </View>
          </View>
        </SkeletonSurface>
      ))}
    </View>
  );
}

export function PlanDaysCarouselSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="gap-3 md:gap-5">
      <ShimmerBlock
        width={isTablet ? 176 : 112}
        height={isTablet ? 34 : 24}
        borderRadius={999}
      />

      <View className="flex-row-reverse gap-2 md:gap-2.5">
        {[0, 1, 2, 3].map((item) => (
          <SkeletonSurface
            key={item}
            className="rounded-3xl px-3 py-4 md:px-5 md:py-6"
          >
            <View className="items-center gap-2 md:gap-3">
              <ShimmerBlock
                width={isTablet ? 118 : 76}
                height={isTablet ? 22 : 15}
                borderRadius={999}
              />
              <ShimmerBlock
                width={isTablet ? 42 : 30}
                height={isTablet ? 42 : 30}
                borderRadius={999}
              />
              <ShimmerBlock
                width={isTablet ? 88 : 54}
                height={isTablet ? 18 : 14}
                borderRadius={999}
              />
            </View>
          </SkeletonSurface>
        ))}
      </View>
    </View>
  );
}

export function PlanDetailTasksSkeleton() {
  return (
    <View className="gap-2.5 md:gap-4">
      {[0, 1, 2].map((item) => (
        <PlanCardSkeleton key={item} />
      ))}
    </View>
  );
}
