import { useState } from "react";
import { useParams } from "react-router-dom";

import StudentPlansHeader from "@/features/admin/plans/components/StudentPlansPage/StudentPlansHeader";
import StudentPlansStatsSection from "@/features/admin/plans/components/StudentPlansPage/StudentPlansStatsSection";
import StudentPlansTableSection from "@/features/admin/plans/components/StudentPlansPage/StudentPlansTableSection";
import { useStudentPlansQuery } from "@/features/admin/plans/queries/plansQueries";

export default function StudentPlansPage() {
  const { id } = useParams();
  const studentId = Number(id);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const plansQuery = useStudentPlansQuery(studentId, { page, limit });

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">خطط الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (plansQuery.isLoading) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">خطط الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الخطط...</p>
      </section>
    );
  }

  if (plansQuery.isError || !plansQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">خطط الطالب</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل الخطط.</p>
      </section>
    );
  }

  const { student, stats, items, total } = plansQuery.data;

  return (
    <div className="space-y-6">
      <StudentPlansHeader student={student} />
      <StudentPlansStatsSection stats={stats} />
      <StudentPlansTableSection
        items={items}
        total={total}
        page={plansQuery.data.page ?? page}
        limit={plansQuery.data.limit ?? limit}
        isFetching={plansQuery.isFetching}
        onChangePage={setPage}
        onChangeRowsPerPage={(nextLimit, nextPage) => {
          setLimit(nextLimit);
          setPage(nextPage);
        }}
      />
    </div>
  );
}

