import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import type { MissedLessonRow } from "@/features/admin/missed-lessons/services/missedLessonsService";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { formatDateArShort } from "@/shared/utils/dates";

type Props = {
  items: MissedLessonRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number, page: number) => void;
};

export default function ProfileMissedLessonsSection(props: Props) {
  const columns = useMemo<TableColumn<MissedLessonRow>[]>(
    () => [
      { name: "الحصة", selector: (row) => row.lessonName, grow: 1.5 },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "التاريخ",
        selector: (row) => formatDateArShort(row.scheduledForDate),
      },
      {
        name: "المشاهدة",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
              row.occurrenceStatus === "watched_late"
                ? "bg-sky-100 text-sky-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {row.occurrenceStatus === "watched_late"
              ? "شوهدت متأخرًا"
              : "لم تُشاهد"}
          </span>
        ),
      },
      {
        name: "المتابعة",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
              row.isResolved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {row.isResolved ? "تمت المتابعة" : "بحاجة للمتابعة"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <AdminServerTable
      columns={columns}
      data={props.items}
      isLoading={props.isLoading}
      loadingText="جاري تحميل الحصص الفائتة..."
      noDataText="لا توجد حصص فائتة لهذا الطالب."
      currentPage={props.page}
      rowsPerPage={props.limit}
      totalRows={props.total}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  );
}
