import type { MyTaskStatus } from "@/features/tasks/types";
import { TaskStatusFilterTabsSkeleton } from "@/features/tasks/components/my-tasks/skeletons";
import {
  SegmentedFilterTabs,
  type SegmentedFilterOption,
} from "@/shared/ui/segmented-filter-tabs";

export type TaskStatusFilterKey = "all" | MyTaskStatus;

const STATUS_OPTIONS: SegmentedFilterOption<TaskStatusFilterKey>[] = [
  { key: "all", label: "الكل" },
  { key: "in_progress", label: "قيد التنفيذ" },
  { key: "completed", label: "مكتملة" },
  { key: "not_started", label: "لم تبدأ" },
];

type TaskStatusFilterTabsProps = {
  value: TaskStatusFilterKey;
  onChange: (value: TaskStatusFilterKey) => void;
  isLoading?: boolean;
};

export function TaskStatusFilterTabs({
  value,
  onChange,
  isLoading = false,
}: TaskStatusFilterTabsProps) {
  if (isLoading) {
    return <TaskStatusFilterTabsSkeleton />;
  }

  return (
    <SegmentedFilterTabs
      options={STATUS_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
