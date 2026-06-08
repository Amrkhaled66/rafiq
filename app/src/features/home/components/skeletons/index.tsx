import { View, useWindowDimensions } from "react-native";

import {
  LessonChecklistCardSkeleton,
  ShimmerBlock,
  SkeletonSurface,
} from "@/shared/ui/skeletons";

function SectionHeaderSkeleton({ isTablet }: { isTablet: boolean }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row-reverse items-center gap-1">
        <ShimmerBlock
          width={isTablet ? 70 : 58}
          height={isTablet ? 18 : 15}
          borderRadius={999}
        />
        <ShimmerBlock
          width={isTablet ? 20 : 16}
          height={isTablet ? 20 : 16}
          borderRadius={999}
        />
      </View>

      <View className="flex-row items-center gap-2">
        <ShimmerBlock
          width={isTablet ? 140 : 118}
          height={isTablet ? 26 : 22}
          borderRadius={999}
        />
        <ShimmerBlock
          width={isTablet ? 40 : 36}
          height={isTablet ? 40 : 36}
          borderRadius={999}
        />
      </View>
    </View>
  );
}

export function ProgressSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const ringSize = isTablet ? 140 : 110;
  const innerRingSize = isTablet ? 104 : 82;
  const ringStroke = isTablet ? 14 : 12;

  return (
    <SkeletonSurface className="px-4 pt-4 md:px-7 md:py-6">
      <View className="gap-4 md:gap-5">
        <SectionHeaderSkeleton isTablet={isTablet} />

        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-1 gap-3">
            <View className="items-end gap-2">
              <ShimmerBlock
                width={isTablet ? 240 : 176}
                height={isTablet ? 30 : 24}
                borderRadius={999}
              />
              <ShimmerBlock
                width={isTablet ? 140 : 104}
                height={isTablet ? 20 : 16}
                borderRadius={999}
              />
            </View>
          </View>

          <View
            className="items-center justify-center"
            style={{ width: ringSize, height: ringSize }}
          >
            <ShimmerBlock
              width={ringSize}
              height={ringSize}
              borderRadius={999}
            />
            <View
              className="absolute rounded-full bg-card"
              style={{
                width: innerRingSize,
                height: innerRingSize,
                borderWidth: ringStroke,
                borderColor: "#E6EAF0",
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonSurface>
  );
}

export function TodayTasksSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="gap-4">
      <SectionHeaderSkeleton isTablet={isTablet} />

      <View className="flex-row flex-wrap items-start justify-between gap-y-2 md:gap-y-3">
        {[0, 1, 2, 3].map((item) => (
          <SkeletonSurface
            key={item}
            className="w-[48.5%] rounded-2xl px-3 py-4 md:px-4.5 md:py-4.5"
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="hidden md:flex">
                <ShimmerBlock width={20} height={20} borderRadius={999} />
              </View>

              <View className="flex-1 items-end">
                <ShimmerBlock
                  width={isTablet ? 140 : 96}
                  height={isTablet ? 22 : 16}
                  borderRadius={999}
                />
              </View>

              <ShimmerBlock
                width={isTablet ? 60 : 40}
                height={isTablet ? 60 : 40}
                borderRadius={14}
              />
            </View>
          </SkeletonSurface>
        ))}
      </View>
    </View>
  );
}

export function TodayLessonsSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="gap-4">
      <SectionHeaderSkeleton isTablet={isTablet} />
      <LessonChecklistCardSkeleton rowsCount={3} />
    </View>
  );
}
