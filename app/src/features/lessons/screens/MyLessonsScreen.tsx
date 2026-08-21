import { RefreshControl, View } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { LessonProgressCard } from "@/features/lessons/components/LessonProgressCard";
import { LessonSection } from "@/features/lessons/components/LessonSection";
import { LessonWatchConfirmationModal } from "@/features/lessons/components/LessonWatchConfirmationModal";
import { useLessonWatchConfirmation } from "@/features/lessons/hooks/useLessonWatchConfirmation";
import {
  useMarkLessonWatched,
  useStudentTodayLessons,
  useUnmarkLessonWatched,
} from "@/features/lessons/queries/lessonQueries";
import { mapStudentTodayLessonsToViewModel } from "@/features/lessons/utils/lessonMappers";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";
import { AppText } from "@/shared/ui/app-text";

export function MyLessonsScreen() {
  const { data, isLoading, isError, isRefetching, refetch } =
    useStudentTodayLessons();
  const markLessonMutation = useMarkLessonWatched();
  const unmarkLessonMutation = useUnmarkLessonWatched();
  const dayData = data ? mapStudentTodayLessonsToViewModel(data) : null;
  const lessonConfirmation = useLessonWatchConfirmation({
    onWatch: (lessonId) => markLessonMutation.mutateAsync(lessonId),
    onUnwatch: (lessonId) => unmarkLessonMutation.mutateAsync(lessonId),
  });

  const handleToggleLesson = (lessonId: number) => {
    if (!dayData) return;

    const lesson = dayData.lessons.find((item) => item.id === lessonId);

    if (!lesson) return;

    lessonConfirmation.requestConfirmation({
      id: lesson.id,
      lessonName: lesson.title,
      intent: lesson.state === "watched" ? "unwatch" : "watch",
    });
  };

  if (isError) {
    return (
      <TabPageLayout>
        <View className="gap-4 md:gap-5">
          <PageTitle title="حصصي" />
          <HomeStateCard
            icon="alert-circle-outline"
            title="حصل مشكلة في تحميل الحصص"
            description="مش قادرين نعرض حصص النهارده دلوقتي. حاول مرة تانية."
            actionLabel="إعادة المحاولة"
            onAction={() => void refetch()}
          />
        </View>
      </TabPageLayout>
    );
  }

  return (
    <TabPageLayout
      scrollProps={{
        alwaysBounceVertical: true,
        refreshControl: (
          <RefreshControl
            progressViewOffset={30}
            refreshing={isRefetching && !isLoading}
            onRefresh={() => void refetch()}
          />
        ),
      }}
    >
      <View className="gap-4 md:gap-5">
        <PageTitle title="حصصي" />
        {dayData ? <PageDateBadge dateLabel={dayData.dateLabel} /> : null}
        <LessonProgressCard
          isLoading={isLoading}
          progress={
            dayData?.progress ?? {
              percentage: 0,
              completedCount: 0,
              totalCount: 0,
            }
          }
          attendedCount={dayData?.attendedCount ?? 0}
          remainingCount={dayData?.remainingCount ?? 0}
        />
        {dayData && dayData?.lessons.length > 0 ? (
          <LessonSection
            isLoading={isLoading}
            lessons={dayData?.lessons ?? []}
            onToggleLesson={handleToggleLesson}
            disabledLessonId={lessonConfirmation.target?.id}
            loadingLessonId={
              lessonConfirmation.isSubmitting
                ? lessonConfirmation.target?.id
                : null
            }
          />
        ) : (
          <View className="border-card-border bg-card rounded-3xl border px-4 py-5 md:px-5 md:py-6">
            <AppText
              className="r mx-auto w-fit text-sm md:text-[15px]"
              tone="muted"
              weight="medium"
            >
              مفيش دروس النهاردة.
            </AppText>
          </View>
        )}
      </View>
      <LessonWatchConfirmationModal
        target={lessonConfirmation.target}
        isSubmitting={lessonConfirmation.isSubmitting}
        errorMessage={lessonConfirmation.errorMessage}
        onConfirm={() => void lessonConfirmation.confirm()}
        onClose={lessonConfirmation.dismiss}
      />
    </TabPageLayout>
  );
}
