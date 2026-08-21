import type { PlanDetailLesson } from "@/features/plans/types";
import { getTodayCairoDateString } from "@/features/plans/utils/plan-ui";
import { LessonWatchRow } from "@/shared/ui/lesson-watch-row";
import { getSubjectUi } from "@/shared/utils/subject-ui";

export function PlanLessonCard({
  lesson,
  date,
  isLoading,
  onPress,
}: {
  lesson: PlanDetailLesson;
  date: string;
  isLoading: boolean;
  onPress: () => void;
}) {
  const subject = getSubjectUi(lesson.subject);
  const today = getTodayCairoDateString();
  const isFuture = date > today;
  const canPress = !isFuture && lesson.status !== "watched_late";
  const state = isFuture
    ? "future"
    : lesson.status === "watched_on_time"
      ? "watched"
      : lesson.status;

  return (
    <LessonWatchRow
      lesson={{
        id: lesson.occurrenceId,
        title: lesson.name,
        subject: subject.label,
        icon: subject.icon,
        iconBackgroundColor: subject.iconBackgroundColor,
        iconColor: subject.iconColor,
        state,
      }}
      trailingMode="status"
      disabled={!canPress}
      isLoading={isLoading}
      onPress={onPress}
    />
  );
}
