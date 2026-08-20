import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, useWindowDimensions } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { SectionTitle } from "@/features/home/components/SectionTitle";
import { TodayLessonsSkeleton } from "@/features/home/components/skeletons";
import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";
import {
  LessonChecklistRow,
  type LessonChecklistItem as LessonItem,
} from "@/shared/ui/lesson-checklist-row";

type TodayLessonsProps = {
  lessons: LessonItem[];
  onViewAll?: () => void;
  isLoading?: boolean;
};

const ENDLESSONSINDEX = 4;

export function TodayLessons({
  lessons,
  onViewAll,
  isLoading = false,
}: TodayLessonsProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const previewLessons = lessons.slice(0, ENDLESSONSINDEX);
  const { colors } = useAppTheme();

  if (isLoading) {
    return <TodayLessonsSkeleton />;
  }

  if (lessons.length === 0) {
    return <TodayLessonsEmpty />;
  }

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <SectionTitle title="دروس اليوم" icon="calendar-outline" />

        <Pressable onPress={onViewAll}>
          <View className="flex-row items-center gap-1">
            <AppText
              className="text-sm md:text-base"
              tone="tint"
              weight="semibold"
            >
              عرض الكل
            </AppText>
            <Ionicons
              name="arrow-back-outline"
              size={isTablet ? 18 : 16}
              color={colors.tint}
            />
          </View>
        </Pressable>

      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 1,
        }}
        className="rounded-2xl! bg-card"
      >
        {previewLessons.map((lesson, index) => (
          <LessonChecklistRow
            key={lesson.id}
            lesson={lesson}
            isLast={index === previewLessons.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

export function TodayLessonsEmpty() {
  return (
    <HomeStateCard
      icon="calendar-outline"
      title="دروس اليوم"
      description="مفيش دروس مجدولة لحد دلوقتي. لما الجدول يتحدث هتلاقيها هنا."
    />
  );
}
