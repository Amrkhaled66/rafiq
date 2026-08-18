import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import { LESSON_WEEKDAY_LABELS } from "@/shared/const/weekdays";
import Table from "@/shared/components/Table";

export default function ProfileLessonsSection({
  lessons,
}: {
  lessons: Lesson[];
}) {
  const columns = useMemo<TableColumn<Lesson>[]>(
    () => [
      {
        name: "اسم الدرس",
        selector: (row) => row.name,
        grow: 1.5,
      },
      {
        name: "المادة",
        selector: (row) => row.subject,
      },
      {
        name: "اليوم",
        selector: (row) => LESSON_WEEKDAY_LABELS[row.weekday] ?? row.weekday,
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">دروس الطالب</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع الدروس المجدولة للطالب ({lessons.length} درس).
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
            لا توجد دروس مجدولة.
          </div>
        }
      />
    </section>
  );
}
