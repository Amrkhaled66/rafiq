import { useState } from "react";

import { TaskProgressCard } from "@/features/tasks/components/TaskProgressCard";
import { TaskSection } from "@/features/tasks/components/TaskSection";
import {
  TaskStatusFilterTabs,
  type TaskStatusFilterKey,
} from "@/features/tasks/components/TaskStatusFilterTabs";
import { MY_TASKS_DAY_DATA } from "@/features/tasks/data/mock-my-tasks-data";
import type { MyTaskItem, MyTaskStatus } from "@/features/tasks/types";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";

function buildTaskStatusCounts(tasks: MyTaskItem[]): Record<MyTaskStatus, number> {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    {
      completed: 0,
      in_progress: 0,
      not_started: 0,
    },
  );
}

export function MyTasksScreen() {
  const dayData = MY_TASKS_DAY_DATA.today;
  const [selectedStatus, setSelectedStatus] =
    useState<TaskStatusFilterKey>("all");

  const visibleTasks =
    selectedStatus === "all"
      ? dayData.tasks
      : dayData.tasks.filter((task) => task.status === selectedStatus);

  const handleTaskPress = (_task: MyTaskItem) => {
    // Placeholder until the task details entrypoint is implemented.
  };

  return (
    <TabPageLayout>
      <PageTitle title="مهامي" />
      <PageDateBadge dateLabel={dayData.dateLabel} />
      <TaskProgressCard
        progress={dayData.progress}
        statusCounts={buildTaskStatusCounts(dayData.tasks)}
      />
      <TaskStatusFilterTabs
        value={selectedStatus}
        onChange={setSelectedStatus}
      />
      <TaskSection tasks={visibleTasks} onTaskPress={handleTaskPress} />
    </TabPageLayout>
  );
}
