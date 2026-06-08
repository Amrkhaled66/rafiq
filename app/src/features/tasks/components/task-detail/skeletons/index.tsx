import { View, useWindowDimensions } from "react-native";

import { ShimmerBlock, SkeletonSurface } from "@/shared/ui/skeletons";

export function TaskDetailHeaderSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="relative mb-9 items-center gap-2 md:gap-2.5">
      <View className="absolute top-2 left-0 md:top-2.5">
        <ShimmerBlock width={44} height={44} borderRadius={16} />
      </View>

      <ShimmerBlock
        width={isTablet ? 240 : 192}
        height={isTablet ? 30 : 26}
        borderRadius={999}
      />
    </View>
  );
}

export function TaskNoteSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-3xl px-5 py-4 md:px-6 md:py-5">
      <View className="items-end gap-3">
        <View className="flex-row-reverse items-center gap-2.5">
          <ShimmerBlock width={20} height={20} borderRadius={999} />
          <ShimmerBlock
            width={isTablet ? 130 : 110}
            height={isTablet ? 22 : 18}
            borderRadius={999}
          />
        </View>

        <View className="items-end gap-2">
          <ShimmerBlock
            width={isTablet ? 260 : 208}
            height={isTablet ? 18 : 16}
            borderRadius={999}
          />
          <ShimmerBlock
            width={isTablet ? 210 : 168}
            height={isTablet ? 18 : 16}
            borderRadius={999}
          />
        </View>
      </View>
    </SkeletonSurface>
  );
}

export function PomodoroCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const timerSize = isTablet ? 246 : 214;

  return (
    <SkeletonSurface className="rounded-3xl px-5 py-4 md:px-6 md:py-10">
      <View className="items-center gap-5 md:gap-6">
        <ShimmerBlock width={timerSize} height={timerSize} borderRadius={999} />

        <View className="w-[82%] flex-row gap-3 md:w-[60%] md:gap-3.5">
          <ShimmerBlock
            width={isTablet ? 80 : 64}
            height={isTablet ? 60 : 40}
            borderRadius={18}
            style={{ width: "45%" }}
          />
          <ShimmerBlock
            width={isTablet ? 80 : 64}
            height={isTablet ? 60 : 40}
            borderRadius={18}
            style={{ width: "45%" }}
          />
        </View>
      </View>
    </SkeletonSurface>
  );
}

export function TaskSessionsStatsCardSkeleton() {
  return (
    <View className="mb-5 flex-row-reverse gap-3 md:mb-6 md:gap-4">
      {[0, 1].map((item) => (
        <SkeletonSurface
          key={item}
          className="flex-1 rounded-3xl px-4 py-3 md:px-5 md:py-4"
        >
          <View className="flex-row-reverse items-center gap-3 md:gap-4">
            <ShimmerBlock width={52} height={52} borderRadius={999} />

            <View className="flex-1 items-end gap-2">
              <ShimmerBlock width={80} height={16} borderRadius={999} />
              <View className="flex-row-reverse items-center gap-2">
                <ShimmerBlock width={20} height={20} borderRadius={999} />
                <ShimmerBlock width={44} height={20} borderRadius={999} />
              </View>
            </View>
          </View>
        </SkeletonSurface>
      ))}
    </View>
  );
}

export function TaskSessionRowSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-3xl px-4 py-4 md:px-5 md:py-4.5">
      <View className="flex-row-reverse items-center gap-3 md:gap-3.5">
        <View className="flex-1 items-end gap-2">
          <View className="flex-row-reverse items-center gap-2 self-stretch md:gap-2.5">
            <ShimmerBlock
              width={isTablet ? 40 : 36}
              height={isTablet ? 40 : 36}
              borderRadius={999}
            />
            <View className="flex-1 items-end gap-1.5">
              <ShimmerBlock
                width={isTablet ? 110 : 90}
                height={isTablet ? 20 : 18}
                borderRadius={999}
              />
              <ShimmerBlock
                width={isTablet ? 130 : 110}
                height={isTablet ? 16 : 14}
                borderRadius={999}
              />
            </View>
          </View>
        </View>

        <View className="items-center gap-1.5">
          <ShimmerBlock
            width={isTablet ? 68 : 56}
            height={isTablet ? 20 : 18}
            borderRadius={999}
          />
          <ShimmerBlock
            width={isTablet ? 44 : 36}
            height={isTablet ? 14 : 12}
            borderRadius={999}
          />
        </View>

        <ShimmerBlock
          width={isTablet ? 72 : 60}
          height={isTablet ? 24 : 22}
          borderRadius={999}
        />
      </View>
    </SkeletonSurface>
  );
}

export function TaskSessionsSectionSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="gap-3 md:gap-4">
      <ShimmerBlock
        width={isTablet ? 170 : 140}
        height={isTablet ? 28 : 24}
        borderRadius={999}
      />

      <View className="gap-2.5 md:gap-3">
        {[0, 1, 2].map((item) => (
          <TaskSessionRowSkeleton key={item} />
        ))}
      </View>
    </View>
  );
}
