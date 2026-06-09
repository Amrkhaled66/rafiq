import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

import type { MyLessonItem } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";
import { LessonChecklistRow } from "@/shared/ui/lesson-checklist-row";
import { LessonChecklistCardSkeleton } from "@/shared/ui/skeletons";

type LessonSectionProps = {
  lessons: MyLessonItem[];
  onToggleLesson: (lessonId: string) => void;
  disabledLessonId?: string | null;
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
  isExpanded = true,
  onToggleExpanded,
  showToggle = false,
  previewCount = 3,
  isLoading = false,
}: LessonSectionProps) {
  const dir = useDirection();
  const visibleLessons = isExpanded ? lessons : lessons.slice(0, previewCount);

  if (isLoading) {
    return <LessonChecklistCardSkeleton rowsCount={3} />;
  }

  return (
    <View className="gap-2.5 md:gap-3">
      <View className={`items-center justify-between ${dir.row}`}>
        <View className="bg-brand-primary-soft rounded-full px-3 py-1 md:px-3.5 md:py-1.5">
          <AppText className="text-xs md:text-[13px]" tone="tint" weight="semibold">
            {lessons.length} حصص
          </AppText>
        </View>

        <AppText className="text-lg md:text-[22px]" weight="bold">
          حصص اليوم
        </AppText>
      </View>

      <View
        className="border-card-border bg-card rounded-[24px] border px-1 py-1 md:px-1.5 md:py-1.5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 1,
        }}
      >
        {visibleLessons.map((lesson, index) => (
          <LessonChecklistRow
            key={lesson.id}
            lesson={lesson}
            isLast={index === visibleLessons.length - 1}
            onPress={onToggleLesson}
            disabled={disabledLessonId === lesson.id}
          />
        ))}
      </View>

      {showToggle && lessons.length > previewCount ? (
        <Pressable
          className="mx-auto w-fit flex-row items-center gap-1 self-end rounded-2xl px-4 py-2 active:opacity-90 md:gap-1.5 md:px-4.5 md:py-2.5"
          onPress={onToggleExpanded}
        >
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
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
