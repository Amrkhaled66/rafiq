import { View, useWindowDimensions } from "react-native";

import {
  ShimmerBlock,
  SkeletonSurface,
} from "@/shared/ui/skeletons";

export function ProfileSectionHeaderSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="flex-row-reverse items-center gap-2">
      <ShimmerBlock
        width={isTablet ? 40 : 22}
        height={isTablet ? 40 : 22}
        borderRadius={16}
      />
      <ShimmerBlock
        width={isTablet ? 140 : 116}
        height={isTablet ? 28 : 18}
        borderRadius={999}
      />
    </View>
  );
}

export function ProfileHeroCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-[30px] overflow-hidden px-5 py-6">
      <View className="flex-row-reverse items-center gap-5">
        <ShimmerBlock
          width={isTablet ? 128 : 100}
          height={isTablet ? 128 : 100}
          borderRadius={999}
        />

        <View className="flex-1 items-end gap-3">
          <ShimmerBlock
            width={isTablet ? 220 : 176}
            height={isTablet ? 32 : 20}
            borderRadius={999}
          />
          <ShimmerBlock
            width={isTablet ? 136 : 120}
            height={isTablet ? 42 : 20}
            borderRadius={999}
          />
        </View>
      </View>
    </SkeletonSurface>
  );
}

export function ProfileActionCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="rounded-3xl px-4 py-4">
      <View className="flex-row-reverse items-center gap-3">
        <ShimmerBlock
          width={44}
          height={44}
          borderRadius={16}
        />

        <View className="flex-1">
          <ShimmerBlock
            width={isTablet ? 170 : 136}
            height={isTablet ? 24 : 20}
            borderRadius={999}
          />
        </View>

        <ShimmerBlock
          width={18}
          height={18}
          borderRadius={999}
        />
      </View>
    </SkeletonSurface>
  );
}

export function SupportSectionCardSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonSurface className="overflow-hidden rounded-[26px]">
      {[0, 1].map((item) => (
        <View
          key={item}
          className={`px-4 py-4 ${item !== 1 ? "border-b border-card-border" : ""}`}
        >
          <View className="flex-row-reverse items-center gap-3">
            <ShimmerBlock
              width={44}
              height={44}
              borderRadius={16}
            />

            <View className="flex-1">
              <ShimmerBlock
                width={isTablet ? 170 : 136}
                height={isTablet ? 24 : 20}
                borderRadius={999}
              />
            </View>

            <ShimmerBlock
              width={18}
              height={18}
              borderRadius={999}
            />
          </View>
        </View>
      ))}
    </SkeletonSurface>
  );
}
