import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { LessonChecklistRow } from "@/features/lessons/components/LessonChecklistRow";
import type { MyLessonItem } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type LessonSectionProps = {
  lessons: MyLessonItem[];
  onToggleLesson: (lessonId: string) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showToggle?: boolean;
  previewCount?: number;
};

export function LessonSection({
  lessons,
  onToggleLesson,
  isExpanded = true,
  onToggleExpanded,
  showToggle = false,
  previewCount = 3,
}: LessonSectionProps) {
  const dir = useDirection();
  const visibleLessons = isExpanded ? lessons : lessons.slice(0, previewCount);

  return (
    <View className="gap-2.5">
      <View className={`items-center justify-between ${dir.row}`}>
        <View className="bg-brand-primary-soft rounded-full px-3 py-1">
          <AppText className="text-xs md:text-sm" tone="tint" weight="semibold">
            {lessons.length} حصص
          </AppText>
        </View>

        <AppText className="text-lg md:text-xl" weight="bold">
          حصص اليوم
        </AppText>
      </View>

      <View
        className="border-card-border bg-card rounded-[24px] border px-1 py-1"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        {visibleLessons.map((lesson, index) => (
          <LessonChecklistRow
            key={lesson.id}
            lesson={lesson}
            isLast={index === visibleLessons.length - 1}
            onToggle={onToggleLesson}
          />
        ))}
      </View>

      {showToggle && lessons.length > previewCount ? (
        <Pressable
          className="mx-auto w-fit flex-row items-center gap-1 self-end rounded-2xl px-4 py-2 active:opacity-90"
          onPress={onToggleExpanded}
        >
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color="#EF7B7D"
          />
          <AppText className="text-brand-primary! text-sm" weight="bold">
            {isExpanded ? "عرض أقل" : "عرض الكل"}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
