import { useState } from "react";
import { View } from "react-native";

import { LessonProgressCard } from "@/features/lessons/components/LessonProgressCard";
import { LessonSection } from "@/features/lessons/components/LessonSection";
import { MY_TASKS_DAY_DATA } from "@/features/tasks/data/mock-my-tasks-data";
import type { MyLessonItem, MyTasksProgress } from "@/features/tasks/types";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";

function cloneTodayLessons() {
  return MY_TASKS_DAY_DATA.today.lessons.map((lesson) => ({ ...lesson }));
}

function buildLessonsProgress(lessons: MyLessonItem[]): MyTasksProgress {
  const totalCount = lessons.length;
  const completedCount = lessons.filter((lesson) => lesson.checked).length;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
    percentage,
    completedCount,
    totalCount,
  };
}

export function MyLessonsScreen() {
  const [lessons, setLessons] = useState(cloneTodayLessons);

  const handleToggleLesson = (lessonId: string) => {
    setLessons((current) =>
      current.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, checked: !lesson.checked }
          : lesson,
      ),
    );
  };

  const lessonsProgress = buildLessonsProgress(lessons);
  const remainingLessonsCount = Math.max(
    lessonsProgress.totalCount - lessonsProgress.completedCount,
    0,
  );

  return (
    <TabPageLayout>
      <View className="gap-4 md:gap-5">
        <PageTitle title="حصصي" />
        <PageDateBadge dateLabel={MY_TASKS_DAY_DATA.today.dateLabel} />
        <LessonProgressCard
          progress={lessonsProgress}
          attendedCount={lessonsProgress.completedCount}
          remainingCount={remainingLessonsCount}
        />
        <LessonSection lessons={lessons} onToggleLesson={handleToggleLesson} />
      </View>
    </TabPageLayout>
  );
}
