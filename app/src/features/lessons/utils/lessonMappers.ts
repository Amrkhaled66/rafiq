import type { StudentTodayLessonsResponse } from "@/features/tasks/types";
import { getSubjectUi } from "@/shared/utils/subject-ui";

export function mapStudentTodayLessonsToViewModel(
  response: StudentTodayLessonsResponse,
) {
  return {
    dateLabel: response.dateLabel,
    progress: response.progress,
    attendedCount: response.attendedCount,
    remainingCount: response.remainingCount,
    lessons: response.lessons.map((lesson) => {
      const subjectUi = getSubjectUi(lesson.subject);

      return {
        id: lesson.id,
        title: lesson.name,
        subject: subjectUi.label,
        icon: subjectUi.icon,
        state: lesson.checked ? ("watched" as const) : ("scheduled" as const),
        iconBackgroundColor: subjectUi.iconBackgroundColor,
        iconColor: subjectUi.iconColor,
      };
    }),
  };
}
