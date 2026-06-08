import { View, useWindowDimensions } from "react-native";

import { ShimmerBlock } from "@/shared/ui/skeletons/shimmer-block";
import { SkeletonSurface } from "@/shared/ui/skeletons/skeleton-surface";

type LessonChecklistCardSkeletonProps = {
  rowsCount?: number;
};

export function LessonChecklistCardSkeleton({
  rowsCount = 3,
}: LessonChecklistCardSkeletonProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-2xl! bg-white">
      {Array.from({ length: rowsCount }).map((_, index) => (
        <View
          key={index}
          className={`rounded-[24px] bg-card px-4 py-4 md:px-6 md:py-5.5 ${
            index !== rowsCount - 1 ? "border-b border-b-card-border" : ""
          }`}
        >
          <View className="flex-row-reverse items-center gap-3 md:gap-4.5">
            <ShimmerBlock
              width={isTablet ? 38 : 28}
              height={isTablet ? 38 : 28}
              borderRadius={12}
            />

            <View className="flex-1">
              <ShimmerBlock
                width={isTablet ? 180 : 108}
                height={isTablet ? 28 : 18}
                borderRadius={999}
              />
            </View>

            <ShimmerBlock
              width={isTablet ? 58 : 44}
              height={isTablet ? 58 : 44}
              borderRadius={18}
            />
          </View>
        </View>
      ))}
    </SkeletonSurface>
  );
}
