import { useState } from "react";
import { useParams } from "react-router-dom";
import CoachAssignedStudentsSection from "@/features/admin/coaches/components/CoachPage/CoachAssignedStudentsSection";
import CoachHeader from "@/features/admin/coaches/components/CoachPage/CoachHeader";
import CoachPlansSection from "@/features/admin/coaches/components/CoachPage/CoachPlansSection";
import CoachStatsSection from "@/features/admin/coaches/components/CoachPage/CoachStatsSection";
import {
  useCoachOverviewQuery,
  useCoachPlansQuery,
} from "@/features/admin/coaches/queries/coachQueries";
import { useStudentsQuery } from "@/features/admin/students/queries/studentQueries";

export default function CoachPage() {
  const params = useParams();
  const coachId = Number(params.id);
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsLimit, setStudentsLimit] = useState(10);
  const [plansPage, setPlansPage] = useState(1);
  const [plansLimit, setPlansLimit] = useState(10);

  const coachOverviewQuery = useCoachOverviewQuery(coachId);
  const coachPlansQuery = useCoachPlansQuery(coachId, {
    page: plansPage,
    limit: plansLimit,
  });
  const studentsQuery = useStudentsQuery({
    coachId,
    page: studentsPage,
    limit: studentsLimit,
  });

  if (!Number.isFinite(coachId) || coachId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل المدرب</h1>
        <p className="text-subTitle mt-2 text-sm">رقم المدرب غير صالح.</p>
      </section>
    );
  }

  if (coachOverviewQuery.isLoading) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل المدرب</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل بيانات المدرب...</p>
      </section>
    );
  }

  if (coachOverviewQuery.isError || !coachOverviewQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل المدرب</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات المدرب.</p>
      </section>
    );
  }

  const { coach, stats } = coachOverviewQuery.data;

  return (
    <div className="space-y-6">
      <CoachHeader coach={coach} />
      <CoachStatsSection stats={stats} />
      <CoachAssignedStudentsSection
        students={studentsQuery.data?.items ?? []}
        currentPage={studentsQuery.data?.page ?? studentsPage}
        rowsPerPage={studentsQuery.data?.limit ?? studentsLimit}
        totalRows={studentsQuery.data?.total ?? 0}
        isLoading={studentsQuery.isLoading || studentsQuery.isFetching}
        onPageChange={setStudentsPage}
        onRowsPerPageChange={(nextLimit, nextPage) => {
          setStudentsLimit(nextLimit);
          setStudentsPage(nextPage);
        }}
      />
      <CoachPlansSection
        plans={coachPlansQuery.data?.items ?? []}
        currentPage={coachPlansQuery.data?.page ?? plansPage}
        rowsPerPage={coachPlansQuery.data?.limit ?? plansLimit}
        totalRows={coachPlansQuery.data?.total ?? 0}
        isLoading={coachPlansQuery.isLoading || coachPlansQuery.isFetching}
        onPageChange={setPlansPage}
        onRowsPerPageChange={(nextLimit, nextPage) => {
          setPlansLimit(nextLimit);
          setPlansPage(nextPage);
        }}
      />
    </div>
  );
}
