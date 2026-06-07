import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { MyLessonItem } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type LessonChecklistRowProps = {
  lesson: MyLessonItem;
  isLast?: boolean;
  onToggle: (lessonId: string) => void;
};

export function LessonChecklistRow({
  lesson,
  isLast = false,
  onToggle,
}: LessonChecklistRowProps) {
  const dir = useDirection();

  return (
    <Pressable
      className={`rounded-[24px] bg-card px-4 py-4 active:opacity-90 ${
        !isLast ? "border-b border-b-card-border" : ""
      }`}
      onPress={() => onToggle(lesson.id)}
    >
      <View className={`items-center gap-3 ${dir.row}`}>
        <View
          className="h-7 w-7 items-center justify-center rounded-lg border"
          style={{
            backgroundColor: lesson.checked ? Colors.light.tint : Colors.light.card,
            borderColor: lesson.checked ? Colors.light.tint : "#D1D5DB",
          }}
        >
          {lesson.checked ? (
            <Ionicons name="checkmark" size={16} color="#ffffff" />
          ) : null}
        </View>

        <View className="flex-1">
          <AppText className="text-base md:text-lg" weight="semibold">
            {lesson.subject}
          </AppText>
        </View>

        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: lesson.iconBackgroundColor }}
        >
          <Ionicons name={lesson.icon} size={20} color={lesson.iconColor} />
        </View>
      </View>
    </Pressable>
  );
}
