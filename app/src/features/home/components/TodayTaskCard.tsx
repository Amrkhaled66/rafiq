import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, useWindowDimensions } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

export type TaskItem = {
  id: string;
  subject: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor: string;
  iconColor: string;
};

type TodayTaskCardProps = {
  task: TaskItem;
  isLast?: boolean;
  onPress?: (task: TaskItem) => void;
};

export function TodayTaskCard({ task, onPress }: TodayTaskCardProps) {
  const { width } = useWindowDimensions();
  const dir = useDirection();
  const isTablet = width >= 768;

  return (
    <Pressable
      className="w-[48.5%] rounded-2xl bg-white px-3 py-4 md:w-[48.5%] md:px-4.5 md:py-4.5"
      onPress={() => onPress?.(task)}
      disabled={!onPress}
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
          className="size-10 items-center justify-center rounded-xl md:size-15"
          style={{ backgroundColor: task.iconBackgroundColor }}
        >
          <Ionicons
            name={task.icon}
            size={isTablet ? 30 : 22}
            color={task.iconColor}
          />
        </View>
      </View>
    </Pressable>
  );
}
