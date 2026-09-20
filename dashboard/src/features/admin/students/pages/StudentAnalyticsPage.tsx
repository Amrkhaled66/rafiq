import { Link, useParams, useSearchParams } from "react-router-dom";

import AdminPageSkeleton from "@/features/admin/shared/components/skeletons/AdminPageSkeleton";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import ChartPanel from "@/features/admin/students/components/StudentAnalyticsPage/ChartPanel";
import EmptyChart from "@/features/admin/students/components/StudentAnalyticsPage/EmptyChart";
import MetricCard from "@/features/admin/students/components/StudentAnalyticsPage/MetricCard";
import RangeControls from "@/features/admin/students/components/StudentAnalyticsPage/RangeControls";
import StudyTimeBySubjectChart from "@/features/admin/students/components/StudentAnalyticsPage/StudyTimeBySubjectChart";
import StudyTimeOverDaysChart from "@/features/admin/students/components/StudentAnalyticsPage/StudyTimeOverDaysChart";
import SubjectPerformanceChart from "@/features/admin/students/components/StudentAnalyticsPage/SubjectPerformanceChart";
import TaskCompletionTrendChart from "@/features/admin/students/components/StudentAnalyticsPage/TaskCompletionTrendChart";
import {
  countDays,
  fillDailyStudyTime,
  fillTaskCompletionTrend,
  formatStudyMinutes,
  getPresetRange,
} from "@/features/admin/students/components/StudentAnalyticsPage/studentAnalyticsUtils";
import { useStudentStudyTimeAnalyticsQuery } from "@/features/admin/students/queries/studentQueries";
import Button from "@/shared/components/Button";

export default function StudentAnalyticsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const studentId = Number(id);
  const defaultRange = getPresetRange(7);
  const from = searchParams.get("from") ?? defaultRange.from;
  const to = searchParams.get("to") ?? defaultRange.to;
  const totalDays = countDays(from, to);
  const hasValidRange = totalDays > 0 && totalDays <= 90;
  const analyticsQuery = useStudentStudyTimeAnalyticsQuery(
    studentId,
    { from, to },
    hasValidRange,
  );

  function updateRange(nextRange: { from: string; to: string }) {
    setSearchParams(nextRange, { replace: true });
  }

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تحليلات الأداء</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (hasValidRange && analyticsQuery.isLoading && !analyticsQuery.data) {
    return (
      <AdminPageSkeleton header="profile" statsCount={4} contentSections={2} />
    );
  }

  const pageHeader = (
    <PageHeader
      title="تحليلات الأداء"
      subtitle="نظرة مركزة على إنجاز المهام، أداء المواد، وتوزيع وقت المذاكرة."
      action={
        <Link to="..">
          <Button variant="outline" className="bg-white">
            العودة لتفاصيل الطالب
          </Button>
        </Link>
      }
    />
  );

  if (!hasValidRange) {
    return (
      <div className="space-y-6">
        {pageHeader}
        <RangeControls
          from={from}
          to={to}
          hasValidRange={hasValidRange}
          onChange={updateRange}
        />
      </div>
    );
  }

  if (analyticsQuery.isError || !analyticsQuery.data) {
    return (
      <div className="space-y-6">
        {pageHeader}
        <RangeControls
          from={from}
          to={to}
          hasValidRange={hasValidRange}
          onChange={updateRange}
        />
        <section className="dashboard-card text-right">
          <p className="text-sm text-red-500">
            تعذر تحميل بيانات تحليلات الأداء.
          </p>
        </section>
      </div>
    );
  }

  const data = analyticsQuery.data;
  const studyTrend = fillDailyStudyTime(data.daily, from, to);
  const taskTrend = fillTaskCompletionTrend(data.taskCompletionTrend, from, to);
  const totalTasks = data.subjectPerformance.reduce(
    (total, point) => total + point.totalTasks,
    0,
  );
  const completedTasks = data.subjectPerformance.reduce(
    (total, point) => total + point.completedTasks,
    0,
  );
  const missedTasks = data.subjectPerformance.reduce(
    (total, point) => total + point.missedTasks,
    0,
  );
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSessions = data.studyTimeBySubject.reduce(
    (total, point) => total + point.sessionsCount,
    0,
  );
  const hasStudyTrendData = studyTrend.some(
    (point) => point.totalStudyMinutes > 0,
  );
  const hasTaskTrendData = taskTrend.some((point) => point.totalTasks > 0);
  const hasSubjectPerformanceData = data.subjectPerformance.some(
    (point) => point.totalTasks > 0,
  );
  const hasStudyTimeBySubjectData = data.studyTimeBySubject.some(
    (point) => point.totalStudyMinutes > 0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="تحليلات الأداء"
        subtitle={`قراءة أداء الطالب ${data.student.fullName} خلال الفترة المحددة.`}
        action={
          <Link to="..">
            <Button variant="outline" className="bg-white">
              العودة لتفاصيل الطالب
            </Button>
          </Link>
        }
      />

      <RangeControls
        from={from}
        to={to}
        hasValidRange={hasValidRange}
        onChange={updateRange}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="نسبة إنجاز المهام"
          value={`${completionRate}%`}
          detail={`${completedTasks} من ${totalTasks} مهمة`}
          icon="solar:check-circle-linear"
          color="#16a34a"
        />
        <MetricCard
          title="المهام الفائتة"
          value={missedTasks}
          detail="داخل الفترة المحددة"
          icon="solar:danger-triangle-linear"
          color="#dc2626"
        />
        <MetricCard
          title="وقت المذاكرة"
          value={formatStudyMinutes(data.summary.totalStudyMinutes)}
          detail={`${data.summary.activeDays} أيام نشاط`}
          icon="solar:clock-circle-linear"
          color="#2563eb"
        />
        <MetricCard
          title="جلسات المذاكرة"
          value={totalSessions}
          detail={`متوسط ${formatStudyMinutes(data.summary.averageDailyMinutes)} يوميًا`}
          icon="solar:play-circle-linear"
          color="#7c3aed"
        />
      </div>

      <ChartPanel
        title="إجمالي وقت المذاكرة عبر الأيام"
        description="يعرض تطور وقت المذاكرة اليومي للطالب داخل الفترة المحددة."
      >
        {hasStudyTrendData ? (
          <StudyTimeOverDaysChart data={studyTrend} />
        ) : (
          <EmptyChart message="لا توجد جلسات مذاكرة مسجلة داخل هذه الفترة." />
        )}
      </ChartPanel>

      <ChartPanel
        title="اتجاه إنجاز المهام"
        description="يقارن بين إجمالي المهام والمهام المكتملة والفائتة يوميًا."
      >
        {hasTaskTrendData ? (
          <TaskCompletionTrendChart data={taskTrend} />
        ) : (
          <EmptyChart message="لا توجد مهام داخل هذه الفترة." />
        )}
      </ChartPanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartPanel
          title="أداء الطالب حسب المادة"
          description="يوضح توزيع المهام المكتملة والمتبقية والفائتة لكل مادة."
        >
          {hasSubjectPerformanceData ? (
            <SubjectPerformanceChart data={data.subjectPerformance} />
          ) : (
            <EmptyChart message="لا توجد بيانات مهام حسب المادة في هذه الفترة." />
          )}
        </ChartPanel>

        <ChartPanel
          title="وقت المذاكرة حسب المادة"
          description="يعرض أين يقضي الطالب وقت المذاكرة بناءً على جلسات المهام."
        >
          {hasStudyTimeBySubjectData ? (
            <StudyTimeBySubjectChart data={data.studyTimeBySubject} />
          ) : (
            <EmptyChart message="لا توجد جلسات مذاكرة حسب المادة في هذه الفترة." />
          )}
        </ChartPanel>
      </div>

      {analyticsQuery.isFetching && (
        <p className="text-brand-primary text-center text-sm">جاري التحديث...</p>
      )}
    </div>
  );
}
