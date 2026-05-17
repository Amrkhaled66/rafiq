import { useState } from "react";

import SessionsFilters from "@/features/admin/sessions/components/SessionsPage/SessionsFilters";
import SessionsStatsSection from "@/features/admin/sessions/components/SessionsPage/SessionsStatsSection";
import SessionsTable from "@/features/admin/sessions/components/SessionsPage/SessionsTable";
import { useTaskSessionsQuery } from "@/features/admin/sessions/queries/sessionQueries";
import type { SessionStatus } from "@/features/admin/sessions/services/sessionService";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useResetPageOnChange from "@/features/admin/shared/hooks/useResetPageOnChange";
import useServerPagination from "@/features/admin/shared/hooks/useServerPagination";
import { optionalTrim } from "@/shared/utils/query";

export default function SessionsPage() {
  const [studentPhone, setStudentPhone] = useState("");
  const [status, setStatus] = useState<"" | SessionStatus>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const pagination = useServerPagination();
  useResetPageOnChange(pagination.setPage, [studentPhone, status, from, to]);

  const sessionsQuery = useTaskSessionsQuery({
    studentPhone: optionalTrim(studentPhone),
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  if (sessionsQuery.isLoading && !sessionsQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">Sessions</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الجلسات...</p>
      </section>
    );
  }

  if (sessionsQuery.isError || !sessionsQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">Sessions</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات الجلسات.</p>
      </section>
    );
  }

  const { stats, items, total, page, limit } = sessionsQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الجلسات"
        subtitle="متابعة جلسات المهام مع عرض الحالة ومدة الجلسة وإمكانية التصفية."
      />

      <SessionsStatsSection stats={stats} />

      <SessionsFilters
        studentPhone={studentPhone}
        status={status}
        from={from}
        to={to}
        onStudentPhoneChange={setStudentPhone}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
      />

      <SessionsTable
        items={items}
        total={total}
        page={page}
        limit={limit}
        isLoading={sessionsQuery.isFetching}
        onChangePage={pagination.setPage}
        onChangeRowsPerPage={pagination.onChangeRowsPerPage}
      />
    </div>
  );
}
