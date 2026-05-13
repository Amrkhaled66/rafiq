import { useParams } from "react-router-dom";
import StudentHeader from "@/features/admin/students/components/StudentPage/StudentHeader";
import StudentLessonsSection from "@/features/admin/students/components/StudentPage/StudentLessonsSection";
import StudentStatsSection from "@/features/admin/students/components/StudentPage/StudentStatsSection";
import StudentTasksSection from "@/features/admin/students/components/StudentPage/StudentTasksSection";
import { useStudentOverviewQuery } from "@/features/admin/students/queries/studentQueries";

export default function StudentPage() {
  const { id } = useParams();
  const studentId = Number(id);
  const studentOverviewQuery = useStudentOverviewQuery(studentId);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (studentOverviewQuery.isLoading) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">
          جاري تحميل بيانات الطالب...
        </p>
      </section>
    );
  }

  if (studentOverviewQuery.isError || !studentOverviewQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل الطالب</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات الطالب.</p>
      </section>
    );
  }

  const { student, stats, todayTasks, todayLessons } =
    studentOverviewQuery.data;

  return (
    <div className="space-y-6">
      <StudentHeader student={student} />
      <StudentStatsSection stats={stats} />
      <StudentTasksSection tasks={todayTasks} />
      <StudentLessonsSection lessons={todayLessons} />
    </div>
  );
}
