import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

export type LessonChecklistItem = {
  id: string;
  subject: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor: string;
  iconColor: string;
  checked?: boolean;
};

type LessonChecklistRowProps = {
  lesson: LessonChecklistItem;
  isLast?: boolean;
  onPress?: (lessonId: string) => void;
};

export function LessonChecklistRow({
  lesson,
  isLast = false,
  onPress,
}: LessonChecklistRowProps) {
  const dir = useDirection();

  return (
    <Pressable
      className={`rounded-[24px] bg-card px-4 py-4 active:opacity-90 md:px-5 md:py-4.5 ${
        !isLast ? "border-b border-b-card-border" : ""
      }`}
      disabled={!onPress}
      onPress={() => onPress?.(lesson.id)}
    >
      <View className={`items-center gap-3 md:gap-3.5 ${dir.row}`}>
        <View
          className="h-7 w-7 items-center justify-center rounded-lg border md:h-8 md:w-8"
          style={{
            backgroundColor: lesson.checked ? Colors.light.tint : Colors.light.card,
            borderColor: lesson.checked ? Colors.light.tint : "#D1D5DB",
          }}
        >
          {lesson.checked ? (
            <Ionicons name="checkmark" size={17} color="#FFFFFF" />
          ) : null}
        </View>

        <View className="flex-1">
          <AppText className="text-base md:text-[18px]" weight="semibold">
            {lesson.subject}
          </AppText>
        </View>

        <View
          className="h-11 w-11 items-center justify-center rounded-2xl md:h-12 md:w-12"
          style={{ backgroundColor: lesson.iconBackgroundColor }}
        >
          <Ionicons name={lesson.icon} size={21} color={lesson.iconColor} />
        </View>
      </View>
    </Pressable>
  );
}
