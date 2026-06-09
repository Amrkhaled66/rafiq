import type { TaskItem } from "@/features/home/components/TodayTaskCard";
import type {
  HomeLessonResponse,
  HomeTaskResponse,
  StudentHomeResponse,
} from "@/features/home/types";
import type { LessonChecklistItem } from "@/shared/ui/lesson-checklist-row";
import { getSubjectUi } from "@/shared/utils/subject-ui";

function mapTask(task: HomeTaskResponse): TaskItem {
  const subjectUi = getSubjectUi(task.subject);

  return {
    id: String(task.id),
    subject: subjectUi.label,
    title: task.title,
    icon: subjectUi.icon,
    iconBackgroundColor: subjectUi.iconBackgroundColor,
    iconColor: subjectUi.iconColor,
  };
}

function mapLesson(lesson: HomeLessonResponse): LessonChecklistItem {
  const subjectUi = getSubjectUi(lesson.subject);

  return {
    id: String(lesson.id),
    subject: subjectUi.label,
    icon: subjectUi.icon,
    iconBackgroundColor: subjectUi.iconBackgroundColor,
    iconColor: subjectUi.iconColor,
    checked: lesson.checked,
  };
}

export function mapStudentHomeToViewModel(home: StudentHomeResponse) {
  return {
    progress: {
      progress: home.progress.progressPercent,
      completedCount: home.progress.completedCount,
      totalCount: home.progress.totalCount,
    },
    tasks: home.todayTasks.map(mapTask),
    lessons: home.todayLessons.map(mapLesson),
  };
}
