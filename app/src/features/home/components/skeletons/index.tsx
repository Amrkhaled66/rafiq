import { View, useWindowDimensions } from "react-native";

import { ElevatedView } from "@/shared/ui/elevated-view";
import { ShimmerBlock } from "@/shared/ui/shimmer-block";

function SkeletonCard({
  children,
  isTablet,
}: {
  children: React.ReactNode;
  isTablet: boolean;
}) {
  return (
    <ElevatedView
      className="rounded-[28px] bg-white"
      style={{
        paddingHorizontal: isTablet ? 24 : 20,
        paddingVertical: isTablet ? 24 : 20,
      }}
    >
      {children}
    </ElevatedView>
  );
}

function SectionHeaderSkeleton({ isTablet }: { isTablet: boolean }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row-reverse items-center gap-1">
        <ShimmerBlock
          width={isTablet ? 64 : 56}
          height={isTablet ? 16 : 14}
          borderRadius={999}
        />
        <ShimmerBlock
          width={isTablet ? 18 : 16}
          height={isTablet ? 18 : 16}
          borderRadius={999}
        />
      </View>

      <View className="flex-row items-center gap-2">
        <ShimmerBlock
          width={isTablet ? 132 : 112}
          height={isTablet ? 24 : 20}
          borderRadius={999}
        />
        <ShimmerBlock
          width={isTablet ? 44 : 40}
          height={isTablet ? 44 : 40}
          borderRadius={999}
          backgroundColor="#F3E6E6"
        />
      </View>
    </View>
  );
}

export function ProgressSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const ringSize = isTablet ? 132 : 110;
  const innerRingSize = isTablet ? 102 : 86;

  return (
    <SkeletonCard isTablet={isTablet}>
      <View className="flex-row-reverse items-center justify-between">
        <View className="items-end gap-3">
          <View className="flex-row items-start gap-2">
            <View className="items-end gap-2">
              <ShimmerBlock
                width={isTablet ? 140 : 112}
                height={isTablet ? 28 : 24}
                borderRadius={999}
              />
              <ShimmerBlock
                width={isTablet ? 190 : 160}
                height={isTablet ? 18 : 16}
                borderRadius={999}
                backgroundColor="#F3E6E6"
              />
              <ShimmerBlock
                width={isTablet ? 130 : 96}
                height={isTablet ? 18 : 16}
                borderRadius={999}
              />
            </View>
            <ShimmerBlock
              width={isTablet ? 52 : 44}
              height={isTablet ? 52 : 44}
              borderRadius={999}
              backgroundColor="#F3E6E6"
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
            backgroundColor="#F8F5F4"
          />
          <View
            className="absolute rounded-full bg-white"
            style={{
              width: innerRingSize,
              height: innerRingSize,
              borderWidth: isTablet ? 12 : 10,
              borderColor: "#EEF1F4",
            }}
          />
        </View>
      </View>
    </SkeletonCard>
  );
}

export function TodayTasksSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonCard isTablet={isTablet}>
      <View className="gap-4">
        <SectionHeaderSkeleton isTablet={isTablet} />

        <View className="flex-row flex-wrap justify-between gap-y-3">
          {[0, 1, 2, 3].map((item) => (
            <View
              key={item}
              className="w-[40%] rounded-2xl border border-[#F0E1E1] bg-[#FAF7F6]"
              style={{
                width: isTablet ? "100%" : "48.5%",
                paddingHorizontal: isTablet ? 18 : 16,
                paddingVertical: isTablet ? 18 : 16,
              }}
            >
              <View className="flex-row items-center gap-3">
                <View className="flex-1 items-end gap-2">
                  <ShimmerBlock
                    width={isTablet ? 96 : 60}
                    height={isTablet ? 18 : 16}
                    borderRadius={999}
                  />
                  <ShimmerBlock
                    width={isTablet ? 140 : 70}
                    height={isTablet ? 16 : 12}
                    borderRadius={999}
                    backgroundColor="#F3E6E6"
                  />
                </View>
                <ShimmerBlock
                  width={isTablet ? 48 : 44}
                  height={isTablet ? 48 : 44}
                  borderRadius={999}
                  backgroundColor="#F3E6E6"
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </SkeletonCard>
  );
}

export function TodayLessonsSkeleton() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SkeletonCard isTablet={isTablet}>
      <View className="gap-4">
        <SectionHeaderSkeleton isTablet={isTablet} />

        <View className="gap-3">
          {[0, 1].map((item) => (
            <View
              key={item}
              className="flex-row-reverse items-center rounded-[22px] bg-[#FAF7F6]"
              style={{
                paddingHorizontal: isTablet ? 18 : 16,
                paddingVertical: isTablet ? 18 : 16,
              }}
            >
              <ShimmerBlock
                width={isTablet ? 28 : 24}
                height={isTablet ? 28 : 24}
                borderRadius={8}
                backgroundColor="#FFFFFF"
              />
              <View className="mr-3 flex-1 items-end gap-2">
                <ShimmerBlock
                  width={isTablet ? 110 : 96}
                  height={isTablet ? 18 : 16}
                  borderRadius={999}
                />
                <ShimmerBlock
                  width={isTablet ? 92 : 80}
                  height={isTablet ? 16 : 12}
                  borderRadius={999}
                  backgroundColor="#F3E6E6"
                />
                <ShimmerBlock
                  width={isTablet ? 152 : 112}
                  height={isTablet ? 16 : 12}
                  borderRadius={999}
                />
              </View>
              <ShimmerBlock
                width={isTablet ? 52 : 48}
                height={isTablet ? 52 : 48}
                borderRadius={999}
                backgroundColor="#F3E6E6"
              />
            </View>
          ))}
        </View>
      </View>
    </SkeletonCard>
  );
}
