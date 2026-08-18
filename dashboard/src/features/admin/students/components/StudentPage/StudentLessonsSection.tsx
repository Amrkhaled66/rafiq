import { useState } from "react";
import type { StudentOverviewLesson } from "@/features/admin/students/services/studentService";
import {
  useWatchLessonOccurrenceMutation,
  useUnwatchLessonOccurrenceMutation,
} from "@/features/admin/students/queries/studentQueries";
import { formatStudentTime } from "./studentPageUtils";
import Button from "@/shared/components/Button";
const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  scheduled: { label: "مجدولة", className: "bg-slate-100 text-slate-700" },
  watched_on_time: { label: "شوهدت", className: "bg-emerald-100 text-emerald-700" },
  watched_late: { label: "شوهدت متأخرًا", className: "bg-amber-100 text-amber-700" },
  missed: { label: "فائتة", className: "bg-rose-100 text-rose-700" },
};

export default function StudentLessonsSection({
  studentId,
  lessons,
}: {
  studentId: number;
  lessons: StudentOverviewLesson[];
}) {
  const watchMutation = useWatchLessonOccurrenceMutation(studentId);
  const unwatchMutation = useUnwatchLessonOccurrenceMutation(studentId);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const isWatched = (status: string) =>
    status === "watched_on_time" || status === "watched_late";

  async function handleToggle(lesson: StudentOverviewLesson) {
    if (watchMutation.isPending || unwatchMutation.isPending) return;
    setLoadingId(lesson.id);
    try {
      if (isWatched(lesson.status)) {
        await unwatchMutation.mutateAsync(lesson.id);
      } else {
        await watchMutation.mutateAsync(lesson.id);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">دروس اليوم</h2>
        <p className="text-subTitle mt-1 text-sm">
          مواعيد الدروس المجدولة للطالب خلال اليوم.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {lessons.length ? (
          <div >
            {lessons.map((lesson) => {
              const badge = STATUS_BADGE[lesson.status] ?? STATUS_BADGE.scheduled;
              const watched = isWatched(lesson.status);
              const isLoading = loadingId === lesson.id;

              return (
                <article
                  key={lesson.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-right sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground font-semibold">
                        {lesson.lessonName}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-subTitle text-sm">
                      {lesson.subject} — موعد الدرس:{" "}
                      {formatStudentTime(lesson.scheduledAt)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleToggle(lesson)}
                    isLoading={isLoading}
                    variant={watched ? "warning" : "primary"}
                  >
                    {watched ? "الطالب مشفهاش" : "الطالب شافها"}

                  </Button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-subTitle col-span-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm">
            لا توجد دروس مجدولة لليوم حالياً.
          </div>
        )}
      </div>
    </section>
  );
}
