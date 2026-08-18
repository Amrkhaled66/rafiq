import { useParams } from "react-router-dom";
import ProfileInfoSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileInfoSection";
import ProfileStatsSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileStatsSection";
import ProfileMissedTasksSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileMissedTasksSection";
import ProfileMissedLessonsSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileMissedLessonsSection";
import ProfilePlansSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfilePlansSection";
import ProfileLessonsSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileLessonsSection";
import { useStudentProfileQuery } from "@/features/admin/student-profile/queries/studentProfileQueries";
import AdminPageSkeleton from "@/features/admin/shared/components/skeletons/AdminPageSkeleton";

export default function StudentProfilePage() {
  const { id } = useParams();
  const studentId = Number(id);
  const profileQuery = useStudentProfileQuery(studentId);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">ملف الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (profileQuery.isLoading && !profileQuery.data) {
    return (
      <AdminPageSkeleton
        header="profile"
        statsCount={4}
        contentSections={4}
        rows={4}
      />
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">ملف الطالب</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات الطالب.</p>
      </section>
    );
  }

  const { student, assignedCoaches, missedTasks, missedLessons, plans, lessons } =
    profileQuery.data;

  const stats = {
    totalMissedTasks: missedTasks.length,
    totalMissedLessons: missedLessons.length,
    totalPlans: plans.length,
    totalLessons: lessons.length,
  }
  // const stats = useMemo(
  //   () => ({
  //     totalMissedTasks: missedTasks.length,
  //     totalMissedLessons: missedLessons.length,
  //     totalPlans: plans.length,
  //     totalLessons: lessons.length,
  //   }),
  //   [missedTasks, missedLessons, plans, lessons],
  // );

  return (
    <div className="space-y-6">
      <ProfileInfoSection student={student} assignedCoaches={assignedCoaches} />
      <ProfileStatsSection stats={stats} />
      <ProfileMissedTasksSection tasks={missedTasks} />
      <ProfileMissedLessonsSection lessons={missedLessons} />
      <ProfilePlansSection plans={plans} />
      <ProfileLessonsSection lessons={lessons} />
    </div>
  );
}
