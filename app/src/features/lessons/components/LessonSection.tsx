import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

import { AppText } from "@/shared/ui/app-text";
import {
  LessonWatchRow,
  type LessonWatchItem,
} from "@/shared/ui/lesson-watch-row";
import { LessonChecklistCardSkeleton } from "@/shared/ui/skeletons";

type LessonSectionProps = {
  lessons: LessonWatchItem[];
  onToggleLesson: (lessonId: number) => void;
  disabledLessonId?: number | null;
  loadingLessonId?: number | null;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showToggle?: boolean;
  previewCount?: number;
  isLoading?: boolean;
};

export function LessonSection({
  lessons,
  onToggleLesson,
  disabledLessonId,
  loadingLessonId,
  isExpanded = true,
  onToggleExpanded,
  showToggle = false,
  previewCount = 3,
  isLoading = false,
}: LessonSectionProps) {
  const visibleLessons = isExpanded ? lessons : lessons.slice(0, previewCount);

  if (isLoading) {
    return <LessonChecklistCardSkeleton rowsCount={3} />;
  }

  return (
    <View className="gap-2.5 md:gap-3">
      <View className="items-center justify-between flex-row">
        <AppText className="text-lg md:text-[22px]" weight="bold">
          حصص اليوم
        </AppText>
        <View className="bg-brand-primary-soft rounded-full px-3 py-1 md:px-3.5 md:py-1.5">
          <AppText className="text-xs md:text-[13px]" tone="tint" weight="semibold">
            {lessons.length} حصص
          </AppText>
        </View>
      </View>

      <View
        className="border-card-border bg-card rounded-3xl border px-1 py-1 md:px-1.5 md:py-1.5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 1,
        }}
      >
        {visibleLessons.map((lesson, index) => (
          <LessonWatchRow
            key={lesson.id}
            lesson={lesson}
            isLast={index === visibleLessons.length - 1}
            onPress={onToggleLesson}
            disabled={disabledLessonId === lesson.id}
            isLoading={loadingLessonId === lesson.id}
          />
        ))}
      </View>

      {showToggle && lessons.length > previewCount ? (
        <Pressable
          className="mx-auto w-fit flex-row items-center gap-1 self-end rounded-2xl px-4 py-2 active:opacity-90 md:gap-1.5 md:px-4.5 md:py-2.5"
          onPress={onToggleExpanded}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color="#EF7B7D"
          />
          <AppText className="text-brand-primary! text-sm md:text-[15px]" weight="bold">
            {isExpanded ? "عرض أقل" : "عرض الكل"}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
