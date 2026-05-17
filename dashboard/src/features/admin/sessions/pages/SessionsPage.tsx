import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentPhone, setStudentPhone] = useState("");
  const [status, setStatus] = useState<"" | SessionStatus>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Sync status from query param -> state so deep links like `sessions?status=running` work.
  useEffect(() => {
    const raw = (searchParams.get("status") ?? "").trim();
    const next =
      raw === "running" || raw === "completed" || raw === "stopped"
        ? (raw as SessionStatus)
        : "";

    if (next !== status) {
      setStatus(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
        <h1 className="text-foreground text-2xl font-bold">الجلسات</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الجلسات...</p>
      </section>
    );
  }

  if (sessionsQuery.isError || !sessionsQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">الجلسات</h1>
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
        onStatusChange={(next) => {
          setStatus(next);

          // Sync state -> query param so refresh/copy-link keeps the active filter.
          setSearchParams((prev) => {
            const p = new URLSearchParams(prev);
            if (next) {
              p.set("status", next);
            } else {
              p.delete("status");
            }
            return p;
          });
        }}
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
