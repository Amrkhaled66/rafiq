import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, useWindowDimensions } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { SectionTitle } from "@/features/home/components/SectionTitle";
import { TodayLessonsSkeleton } from "@/features/home/components/skeletons";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
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
  const dir = useDirection();
  const isTablet = width >= 768;
  const previewLessons = lessons.slice(0, ENDLESSONSINDEX);

  if (isLoading) {
    return <TodayLessonsSkeleton />;
  }

  if (lessons.length === 0) {
    return <TodayLessonsEmpty />;
  }

  return (
    <View className="gap-4">
      <View className={`items-center justify-between ${dir.row}`}>
        <Pressable onPress={onViewAll}>
          <View className={`items-center gap-1 ${dir.rowReverse}`}>
            <AppText
              className={`${dir.textAlign} text-sm md:text-base`}
              tone="tint"
              weight="semibold"
            >
              عرض الكل
            </AppText>
            <Ionicons
              name={dir.isRTL ? "arrow-back-outline" : "arrow-forward-outline"}
              size={isTablet ? 18 : 16}
              color={Colors.light.tint}
            />
          </View>
        </Pressable>

        <SectionTitle title="دروس اليوم" icon="calendar-outline" />
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#F1F1F1",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 1,
        }}
        className="rounded-2xl! bg-white"
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
