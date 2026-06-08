import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

import { TaskSectionSkeleton } from "@/features/tasks/components/my-tasks/skeletons";
import type { MyTaskItem, MyTaskStatus } from "@/features/tasks/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";
import { TaskCard } from "@/shared/ui/task-card";
import { Colors } from "@/shared/theme/theme";

function getStatusAppearance(status: MyTaskStatus) {
  switch (status) {
    case "completed":
      return {
        label: "مكتملة",
        backgroundColor: "#DCFCE7",
        textColor: "#166534",
      };
    case "not_started":
      return {
        label: "لم تبدأ",
        backgroundColor: "#FEF3C7",
        textColor: "#B45309",
      };
    default:
      return {
        label: "قيد التنفيذ",
        backgroundColor: Colors.light.soft,
        textColor: Colors.light.tint,
      };
  }
}

type TaskSectionProps = {
  tasks: MyTaskItem[];
  onTaskPress?: (task: MyTaskItem) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showToggle?: boolean;
  previewCount?: number;
  isLoading?: boolean;
};

export function TaskSection({
  tasks,
  onTaskPress,
  isExpanded = true,
  onToggleExpanded,
  showToggle = false,
  previewCount = 3,
  isLoading = false,
}: TaskSectionProps) {
  const dir = useDirection();
  const visibleTasks = isExpanded ? tasks : tasks.slice(0, previewCount);

  if (isLoading) {
    return <TaskSectionSkeleton />;
  }

  return (
    <View className="gap-2.5 md:gap-3">
      <View className="gap-2.5 md:gap-3">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => {
            const statusAppearance = getStatusAppearance(task.status);

            return (
              <View key={task.id}>
                <TaskCard
                  title={task.title}
                  subject={task.subject}
                  icon={task.icon}
                  iconBackgroundColor={task.iconBackgroundColor}
                  iconColor={task.iconColor}
                  statusLabel={statusAppearance.label}
                  statusBackgroundColor={statusAppearance.backgroundColor}
                  statusTextColor={statusAppearance.textColor}
                  onPress={() => onTaskPress?.(task)}
                />
              </View>
            );
          })
        ) : (
          <View className="border-card-border bg-card rounded-3xl border px-4 py-5 md:px-5 md:py-6">
            <AppText
              className="text-sm md:text-[15px]"
              tone="muted"
              weight="medium"
            >
              لا توجد مهام بهذه الحالة الآن.
            </AppText>
          </View>
        )}
      </View>

      {showToggle && tasks.length > previewCount ? (
        <Pressable
          className="mx-auto w-fit flex-row items-center gap-1 self-end rounded-2xl px-4 py-2 active:opacity-90 md:gap-1.5 md:px-4.5 md:py-2.5"
          onPress={onToggleExpanded}
        >
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color="#EF7B7D"
          />
          <AppText
            className="text-brand-primary! text-sm md:text-[15px]"
            weight="bold"
          >
            {isExpanded ? "عرض أقل" : "عرض الكل"}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
