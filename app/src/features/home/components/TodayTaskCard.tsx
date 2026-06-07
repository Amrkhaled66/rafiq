import { Ionicons } from "@expo/vector-icons";
import { View, useWindowDimensions } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

export type TaskItem = {
  subject: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundClassName: string;
  iconColor: string;
};

type TodayTaskCardProps = {
  task: TaskItem;
  isLast?: boolean;
};

export function TodayTaskCard({ task }: TodayTaskCardProps) {
  const { width } = useWindowDimensions();
  const dir = useDirection();
  const isTablet = width >= 768;

  return (
    <View
      className="w-[48.5%] rounded-2xl bg-white px-3 py-4 md:w-[48.5%] md:px-4.5 md:py-4.5"
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
    >
      <View className={`items-center justify-between gap-3 ${dir.row}`}>
        <View className="hidden md:flex!">
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
            size={22}
            color="#EF7B7D"
          />
        </View>

        <View className="flex-1">
          <AppText
            className={`text-sm md:text-lg ${dir.textAlign}`}
            weight="semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task.title}
          </AppText>
        </View>

        <View
          className={`size-10 items-center justify-center rounded-xl md:size-15 ${task.iconBackgroundClassName}`}
        >
          <Ionicons
            name={task.icon}
            size={isTablet ? 30 : 22}
            color={task.iconColor}
          />
        </View>
      </View>
    </View>
  );
}
