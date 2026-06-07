import { Pressable, View } from "react-native";

import type { TaskSessionItem } from "@/features/tasks/types";
import { TaskSessionRow } from "@/features/tasks/components/task-detail/TaskSessionRow";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type TaskSessionsSectionProps = {
  sessions: TaskSessionItem[];
  onSessionPress?: (session: TaskSessionItem) => void;
  onViewAll?: () => void;
};

export function TaskSessionsSection({
  sessions,
  onSessionPress,
  onViewAll,
}: TaskSessionsSectionProps) {
  const dir = useDirection();

  return (
    <View className="gap-3">
      <View className={`items-center justify-between ${dir.rowReverse}`}>
        <AppText className="text-lg md:text-xl" weight="bold">
          الجلسات السابقة
        </AppText>
        <Pressable className="px-2 py-1 active:opacity-80" onPress={onViewAll}>
          <AppText className="text-sm text-brand-primary" weight="bold">
            عرض الكل
          </AppText>
        </Pressable>
      </View>

      <View className="gap-2.5">
        {sessions.map((session, index) => (
          <TaskSessionRow
            key={session.id}
            session={session}
            index={sessions.length - index - 1}
            onPress={onSessionPress}
          />
        ))}
      </View>
    </View>
  );
}
