import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
import { Pressable, View } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { SectionTitle } from "@/features/home/components/SectionTitle";
import { TodayTasksSkeleton } from "@/features/home/components/skeletons";
import {
  TodayTaskCard,
  type TaskItem,
} from "@/features/home/components/TodayTaskCard";
import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";

type TodayTasksProps = {
  tasks: TaskItem[];
  isLoading?: boolean;
};

const ENDPREVIEWINDEX = 4;

export function TodayTasks({ tasks, isLoading = false }: TodayTasksProps) {
  const { colors } = useAppTheme();
  const previewTasks = tasks.slice(0, ENDPREVIEWINDEX);

  const handleTaskPress = (task: TaskItem) => {
    router.push(`/tasks/${task.id}` as RelativePathString);
  };

  if (isLoading) {
    return <TodayTasksSkeleton />;
  }

  if (tasks.length === 0) {
    return <TodayTasksEmpty />;
  }

  return (
    <View className="gap-4">
      <View className="items-center justify-between flex-row">
        <SectionTitle title="مهامك النهاردة" icon="list-outline" />
        <Pressable onPress={() => router.push("/(tabs)/my-tasks")}>
          <View className="items-center gap-1 flex-row">
            <AppText
              className=" text-sm md:text-base"
              tone="tint"
              weight="semibold"
            >
              عرض الكل
            </AppText>
            <Ionicons
              name="arrow-back-outline"
              size={16}
              color={colors.tint}
            />
          </View>
        </Pressable>

      </View>

      <View className="flex-row flex-wrap items-center justify-start gap-y-2 md:gap-y-3">
        {previewTasks.map((task, index) => (
          <TodayTaskCard
            isLast={index === ENDPREVIEWINDEX - 1}
            key={task.id}
            task={task}
            onPress={handleTaskPress}
          />
        ))}
      </View>
    </View>
  );
}

export function TodayTasksEmpty() {
  return (
    <HomeStateCard
      icon="list-outline"
      title="مهامك النهاردة"
      description="مفيش مهام لعرضها دلوقتي. أول ما تتضاف مهام جديدة هتظهر هنا."
    />
  );
}
