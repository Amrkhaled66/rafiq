import type {
  StudentTodayTasksResponse,
  TaskApiStatus,
} from "@/features/tasks/types";
import { getSubjectUi } from "@/shared/utils/subject-ui";

function mapApiStatusToUiStatus(status: TaskApiStatus) {
  switch (status) {
    case "done":
      return "completed" as const;
    case "in_progress":
      return "in_progress" as const;
    default:
      return "not_started" as const;
  }
}

export function mapStudentTodayTasksToViewModel(
  response: StudentTodayTasksResponse,
) {
  return {
    dateLabel: response.dateLabel,
    progress: response.progress,
    statusCounts: response.statusCounts,
    tasks: response.tasks.map((task) => {
      const subjectUi = getSubjectUi(task.subject);

      return {
        id: String(task.id),
        title: task.title,
        subject: subjectUi.label,
        status: mapApiStatusToUiStatus(task.status),
        icon: subjectUi.icon,
        iconBackgroundColor: subjectUi.iconBackgroundColor,
        iconColor: subjectUi.iconColor,
      };
    }),
  };
}
