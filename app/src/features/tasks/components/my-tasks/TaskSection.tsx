import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

import { MyTaskCard } from "@/features/tasks/components/my-tasks/MyTaskCard";
import type { MyTaskItem } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type TaskSectionProps = {
  tasks: MyTaskItem[];
  onTaskPress?: (task: MyTaskItem) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showToggle?: boolean;
  previewCount?: number;
};

export function TaskSection({
  tasks,
  onTaskPress,
  isExpanded = true,
  onToggleExpanded,
  showToggle = false,
  previewCount = 3,
}: TaskSectionProps) {
  const dir = useDirection();
  const visibleTasks = isExpanded ? tasks : tasks.slice(0, previewCount);

  return (
    <View className="gap-2.5">
      <View className="gap-2.5">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => (
            <MyTaskCard key={task.id} task={task} onPress={onTaskPress} />
          ))
        ) : (
          <View className="rounded-3xl border border-card-border bg-card px-4 py-5">
            <AppText className="text-sm md:text-base" tone="muted" weight="medium">
              لا توجد مهام بهذه الحالة الآن.
            </AppText>
          </View>
        )}
      </View>

      {showToggle && tasks.length > previewCount ? (
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
