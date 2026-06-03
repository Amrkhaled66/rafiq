import { Ionicons } from "@expo/vector-icons";
import { View, useWindowDimensions } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

export type LessonItem = {
  subject: string;
  time: string;
  teacher: string;
  icon: keyof typeof Ionicons.glyphMap;
  attended?: boolean;
};

type TodayLessonCardProps = {
  lesson: LessonItem;
  isLast?: boolean;
};

export function TodayLessonCard({
  lesson,
  isLast = false,
}: TodayLessonCardProps) {
  const { width } = useWindowDimensions();
  const dir = useDirection();
  const isTablet = width >= 768;

  return (
    <View className="w-full px-4 py-4 md:px-4.5 md:py-4.5">
      <View className={`items-center justify-between gap-3 ${dir.row}`}>
        {/* Lesson icon */}
        <View className="bg-brand-primary-soft/70 h-11 w-11 items-center justify-center rounded-xl md:h-13 md:w-13">
          <Ionicons
            name={lesson.icon}
            size={isTablet ? 25 : 22}
            color={Colors.light.tint}
          />
        </View>

        {/* Lesson info */}
        <View className={`flex-1 ${dir.itemsAlign}`}>
          <View className={`items-center gap-2 ${dir.row}`}>
            <AppText
              className={dir.textAlign}
              weight="semibold"
              style={{ fontSize: isTablet ? 18 : 16 }}
              numberOfLines={1}
            >
              {lesson.subject}
            </AppText>

            {lesson.attended ? (
              <View className="bg-brand-primary-soft rounded-full px-2 py-1">
                <AppText
                  className="text-center"
                  tone="tint"
                  weight="bold"
                  style={{ fontSize: isTablet ? 11 : 9 }}
                >
                  تم الحضور
                </AppText>
              </View>
            ) : null}
          </View>
        </View>

        {/* Checkbox */}
        <View
          className={`h-7 w-7 items-center justify-center rounded-lg border md:h-8 md:w-8 ${
            lesson.attended
              ? "border-brand-primary bg-brand-primary"
              : "border-[#D1D5DB] bg-white"
          }`}
        >
          {lesson.attended ? (
            <Ionicons
              name="checkmark"
              size={isTablet ? 17 : 15}
              color="#FFFFFF"
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
