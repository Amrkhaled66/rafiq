import { View } from "react-native";

import type { TaskSessionItem } from "@/features/tasks/types";
import { TaskSessionRow } from "@/features/tasks/components/task-detail/TaskSessionRow";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type TaskSessionsSectionProps = {
  sessions: TaskSessionItem[];
};

export function TaskSessionsSection({ sessions }: TaskSessionsSectionProps) {
  const dir = useDirection();

  return (
    <View className="gap-3 md:gap-4">
      <View className={`items-center justify-between ${dir.rowReverse}`}>
        <AppText className="text-lg md:text-[22px]" weight="bold">
          الجلسات السابقة
        </AppText>
      </View>

      <View className="gap-2.5 md:gap-3">
        {sessions.map((session, index) => (
          <TaskSessionRow
            key={session.id}
            session={session}
            index={sessions.length - index - 1}
          />
        ))}
      </View>
    </View>
  );
}
