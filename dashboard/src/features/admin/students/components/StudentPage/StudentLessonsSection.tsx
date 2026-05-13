import type { StudentOverviewLesson } from "@/features/admin/students/services/studentService";
import { Icon } from "@iconify/react";
import { formatStudentTime } from "./studentPageUtils";

export default function StudentLessonsSection({
  lessons,
}: {
  lessons: StudentOverviewLesson[];
}) {
  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">دروس اليوم</h2>
        <p className="text-subTitle mt-1 text-sm">
          مواعيد الدروس المجدولة للطالب خلال اليوم.
        </p>
      </div>

      {lessons.length ? (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-right sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-foreground font-semibold">
                  {lesson.subject}
                </h3>
                <p className="text-subTitle text-sm">
                  موعد الدرس: {formatStudentTime(lesson.scheduledAt)}
                </p>
              </div>

              <div className="text-brand-primary inline-flex items-center gap-2 text-sm">
                <Icon icon="solar:clock-circle-linear" className="size-4" />
                <span>{formatStudentTime(lesson.scheduledAt)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-subTitle rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm">
          لا توجد دروس مجدولة لليوم حالياً.
        </div>
      )}
    </section>
  );
}
