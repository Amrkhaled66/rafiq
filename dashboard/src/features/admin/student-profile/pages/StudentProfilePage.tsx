import { Icon } from "@iconify/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProfileInfoSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileInfoSection";
import ProfileStatsSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileStatsSection";
import ProfileMissedTasksSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileMissedTasksSection";
import ProfileMissedLessonsSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileMissedLessonsSection";
import ProfilePlansSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfilePlansSection";
import ProfileLessonsSection from "@/features/admin/student-profile/components/StudentProfilePage/ProfileLessonsSection";
import { useStudentProfileQuery } from "@/features/admin/student-profile/queries/studentProfileQueries";
import { useMissedTasksQuery } from "@/features/admin/missed-tasks/queries/missedTasksQueries";
import { useMissedLessonsQuery } from "@/features/admin/missed-lessons/queries/missedLessonsQueries";
import { useStudentPlansQuery } from "@/features/admin/plans/queries/plansQueries";
import { useStudentLessonsQuery } from "@/features/admin/lessons/queries/lessonQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import AdminPageSkeleton from "@/features/admin/shared/components/skeletons/AdminPageSkeleton";
import useServerPagination from "@/features/admin/shared/hooks/useServerPagination";
import Button from "@/shared/components/Button";
import { urls } from "@/shared/const/urls";

const PROFILE_TABS = [
  { id: "missed-tasks", label: "المهام الفائتة", icon: "solar:danger-triangle-linear" },
  { id: "missed-lessons", label: "الحصص الفائتة", icon: "solar:videocamera-record-linear" },
  { id: "plans", label: "الخطط", icon: "solar:clipboard-list-linear" },
  { id: "lessons", label: "الدروس", icon: "solar:book-bookmark-linear" },
] as const;

type ProfileTab = (typeof PROFILE_TABS)[number]["id"];

function isProfileTab(value: string | null): value is ProfileTab {
  return PROFILE_TABS.some((tab) => tab.id === value);
}

function RequestState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
      <Icon icon="solar:danger-circle-linear" className="size-10 text-red-500" />
      <p className="text-subTitle text-sm">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        إعادة المحاولة
      </Button>
    </div>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const studentId = Number(id);
  const isValidStudentId = Number.isInteger(studentId) && studentId > 0;
  const requestedTab = searchParams.get("tab");
  const activeTab: ProfileTab = isProfileTab(requestedTab)
    ? requestedTab
    : "missed-tasks";

  const missedTasksPagination = useServerPagination();
  const missedLessonsPagination = useServerPagination();
  const plansPagination = useServerPagination();

  const profileQuery = useStudentProfileQuery(studentId);
  const missedTasksQuery = useMissedTasksQuery(
    {
      studentId,
      page: missedTasksPagination.page,
      limit: missedTasksPagination.limit,
    },
    isValidStudentId && activeTab === "missed-tasks",
  );
  const missedLessonsQuery = useMissedLessonsQuery(
    {
      studentId,
      page: missedLessonsPagination.page,
      limit: missedLessonsPagination.limit,
    },
    isValidStudentId && activeTab === "missed-lessons",
  );
  const plansQuery = useStudentPlansQuery(
    studentId,
    {
      page: plansPagination.page,
      limit: plansPagination.limit,
    },
    isValidStudentId && activeTab === "plans",
  );
  const lessonsQuery = useStudentLessonsQuery(
    studentId,
    isValidStudentId && activeTab === "lessons",
  );

  function changeTab(tab: ProfileTab) {
    missedTasksPagination.setPage(1);
    missedLessonsPagination.setPage(1);
    plansPagination.setPage(1);
    setSearchParams({ tab }, { replace: true });
  }

  if (!isValidStudentId) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon="solar:user-circle-linear"
          title="ملف متابعة الطالب"
        />
        <section className="dashboard-card">
          <RequestState
            message="رقم الطالب الموجود في الرابط غير صالح."
            onRetry={() => navigate(`/${urls.dashBoardUrl}/student-profile`)}
          />
        </section>
      </div>
    );
  }

  if (profileQuery.isLoading && !profileQuery.data) {
    return <AdminPageSkeleton header="profile" statsCount={4} contentSections={1} />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon="solar:user-circle-linear"
          title="ملف متابعة الطالب"
        />
        <section className="dashboard-card">
          <RequestState
            message="تعذر تحميل بيانات الطالب."
            onRetry={() => void profileQuery.refetch()}
          />
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => navigate(`/${urls.dashBoardUrl}/student-profile`)}
            >
              العودة إلى البحث
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const { student, assignedCoaches, stats } = profileQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        icon="solar:user-circle-linear"
        title="ملف متابعة الطالب"
        subtitle={`متابعة السجل الدراسي للطالب ${student.fullName}.`}
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/${urls.dashBoardUrl}/student-profile`)}
            >
              بحث عن طالب آخر
            </Button>
            <Button
              onClick={() =>
                navigate(`/${urls.dashBoardUrl}/students/${studentId}`)
              }
            >
              عرض تفاصيل الطالب
            </Button>
          </div>
        }
      />

      <ProfileInfoSection student={student} assignedCoaches={assignedCoaches} />
      <ProfileStatsSection stats={stats} />

      <section className="dashboard-card overflow-hidden">
        <div
          className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 lg:grid-cols-4"
          role="tablist"
          aria-label="أقسام متابعة الطالب"
        >
          {PROFILE_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => changeTab(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  selected
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-subTitle hover:bg-white/60 hover:text-foreground"
                }`}
              >
                <Icon icon={tab.icon} className="size-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel">
          {activeTab === "missed-tasks" &&
            (missedTasksQuery.isError ? (
              <RequestState
                message="تعذر تحميل المهام الفائتة."
                onRetry={() => void missedTasksQuery.refetch()}
              />
            ) : (
              <ProfileMissedTasksSection
                items={missedTasksQuery.data?.items ?? []}
                total={missedTasksQuery.data?.total ?? 0}
                page={missedTasksQuery.data?.page ?? missedTasksPagination.page}
                limit={missedTasksQuery.data?.limit ?? missedTasksPagination.limit}
                isLoading={missedTasksQuery.isLoading || missedTasksQuery.isFetching}
                onPageChange={missedTasksPagination.setPage}
                onRowsPerPageChange={missedTasksPagination.onChangeRowsPerPage}
              />
            ))}

          {activeTab === "missed-lessons" &&
            (missedLessonsQuery.isError ? (
              <RequestState
                message="تعذر تحميل الحصص الفائتة."
                onRetry={() => void missedLessonsQuery.refetch()}
              />
            ) : (
              <ProfileMissedLessonsSection
                items={missedLessonsQuery.data?.items ?? []}
                total={missedLessonsQuery.data?.total ?? 0}
                page={missedLessonsQuery.data?.page ?? missedLessonsPagination.page}
                limit={missedLessonsQuery.data?.limit ?? missedLessonsPagination.limit}
                isLoading={missedLessonsQuery.isLoading || missedLessonsQuery.isFetching}
                onPageChange={missedLessonsPagination.setPage}
                onRowsPerPageChange={missedLessonsPagination.onChangeRowsPerPage}
              />
            ))}

          {activeTab === "plans" &&
            (plansQuery.isError ? (
              <RequestState
                message="تعذر تحميل الخطط الدراسية."
                onRetry={() => void plansQuery.refetch()}
              />
            ) : (
              <ProfilePlansSection
                studentId={studentId}
                items={plansQuery.data?.items ?? []}
                total={plansQuery.data?.total ?? 0}
                page={plansQuery.data?.page ?? plansPagination.page}
                limit={plansQuery.data?.limit ?? plansPagination.limit}
                isLoading={plansQuery.isLoading || plansQuery.isFetching}
                onPageChange={plansPagination.setPage}
                onRowsPerPageChange={plansPagination.onChangeRowsPerPage}
              />
            ))}

          {activeTab === "lessons" &&
            (lessonsQuery.isError ? (
              <RequestState
                message="تعذر تحميل الدروس المجدولة."
                onRetry={() => void lessonsQuery.refetch()}
              />
            ) : (
              <ProfileLessonsSection
                lessons={lessonsQuery.data ?? []}
                isLoading={lessonsQuery.isLoading || lessonsQuery.isFetching}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
