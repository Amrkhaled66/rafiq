import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { MissedLessonRow } from "@/features/admin/missed-lessons/services/missedLessonsService";
import Table from "@/shared/components/Table";

export default function ProfileMissedLessonsSection({
  lessons,
}: {
  lessons: MissedLessonRow[];
}) {
  const columns = useMemo<TableColumn<MissedLessonRow>[]>(
    () => [
      {
        name: "اسم الدرس",
        selector: (row) => row.lessonName,
        grow: 1.5,
      },
      {
        name: "المادة",
        selector: (row) => row.subject,
      },
      {
        name: "التاريخ",
        selector: (row) => row.scheduledForDate,
      },
      {
        name: "الحالة",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              row.isResolved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {row.isResolved
              ? "تم الحل"
              : row.occurrenceStatus === "watched_late"
                ? "شوهدت متأخرًا"
                : "فائتة"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">الحصص الفائتة</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع الحصص الفائتة للطالب ({lessons.length} حصة).
        </p>
      </div>

      <Table
        columns={columns}
        data={lessons}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        responsive
        highlightOnHover
        persistTableHead
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد حصص فائتة.
          </div>
        }
      />
    </section>
  );
}
