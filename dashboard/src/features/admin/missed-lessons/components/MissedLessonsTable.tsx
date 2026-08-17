import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import type { MissedLessonRow } from "@/features/admin/missed-lessons/services/missedLessonsService";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import InfoTooltipCell from "@/features/admin/shared/components/InfoTooltipCell";
import Button from "@/shared/components/Button";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { urls } from "@/shared/const/urls";
import { formatDateArShort } from "@/shared/utils/dates";

const WEEKDAY_LABELS: Record<string, string> = {
  saturday: "السبت",
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
};

function Badge({
  children,
  className,
}: {
  children: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export default function MissedLessonsTable({
  items,
  total,
  page,
  limit,
  isLoading,
  pendingOccurrenceId,
  onResolve,
  onUnresolve,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: MissedLessonRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  pendingOccurrenceId: number | null;
  onResolve: (row: MissedLessonRow) => void;
  onUnresolve: (row: MissedLessonRow) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (limit: number, page: number) => void;
}) {
  const navigate = useNavigate();
  const columns = useMemo<TableColumn<MissedLessonRow>[]>(
    () => [
      {
        name: "الطالب",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary font-medium hover:underline"
            onClick={() =>
              navigate(`/${urls.dashBoardUrl}/students/${row.studentId}`)
            }
          >
            {row.studentName}
          </button>
        ),
        grow: 1.2,
      },
      { name: "الحصة", selector: (row) => row.lessonName, grow: 1.4 },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "التاريخ",
        cell: (row) => (
          <div>
            <p>{formatDateArShort(row.scheduledForDate)}</p>
            <p className="text-subTitle text-xs">
              {WEEKDAY_LABELS[row.scheduledWeekday] ?? row.scheduledWeekday}
            </p>
          </div>
        ),
      },
      {
        name: "المشاهدة",
        cell: (row) =>
          row.occurrenceStatus === "watched_late" ? (
            <Badge className="bg-sky-100 text-sky-700">شوهدت متأخرًا</Badge>
          ) : (
            <Badge className="bg-rose-100 text-rose-700">لم تُشاهد</Badge>
          ),
        minWidth: "140px",
      },
      {
        name: "المتابعة",
        cell: (row) => (
          <Badge
            className={
              row.isResolved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-800"
            }
          >
            {row.isResolved ? "تمت المتابعة" : "بحاجة للمتابعة"}
          </Badge>
        ),
        minWidth: "145px",
      },
      {
        name: "الملاحظة",
        cell: (row) =>
          row.resolutionNote ? (
            <InfoTooltipCell
              tooltipText={row.resolutionNote}
              tooltipLabel="عرض الملاحظة"
            >
              <span className="text-foreground block max-w-44 truncate">
                {row.resolutionNote}
              </span>
            </InfoTooltipCell>
          ) : (
            "-"
          ),
        allowOverflow: true,
        grow: 1.4,
      },
      {
        name: "المدربون",
        selector: (row) =>
          row.assignedCoaches.map((coach) => coach.name).join("، ") || "-",
        grow: 1.4,
      },
      {
        name: "تفاصيل المتابعة",
        cell: (row) =>
          row.isResolved ? (
            <div className="text-sm">
              <p>{row.resolvedByName ?? "-"}</p>
              <p className="text-subTitle text-xs">
                {row.resolvedAt ? formatDateArShort(row.resolvedAt) : "-"}
              </p>
            </div>
          ) : (
            "-"
          ),
        minWidth: "145px",
      },
      {
        name: "",
        cell: (row) => (
          <Button
            variant={row.isResolved ? "outline" : "primary"}
            className="text-xs!"
            isLoading={pendingOccurrenceId === row.occurrenceId}
            onClick={() => (row.isResolved ? onUnresolve(row) : onResolve(row))}
          >
            {row.isResolved ? "إلغاء المتابعة" : "تسجيل المتابعة"}
          </Button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [navigate, onResolve, onUnresolve, pendingOccurrenceId],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">
          قائمة الحصص الفائتة
        </h2>
        <p className="text-subTitle mt-1 text-sm">
          الحصص التي انتهى يومها دون مشاهدة في الموعد.
        </p>
      </div>
      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        loadingText="جاري تحميل الحصص الفائتة..."
        noDataText="لا توجد حصص فائتة لعرضها"
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </section>
  );
}
