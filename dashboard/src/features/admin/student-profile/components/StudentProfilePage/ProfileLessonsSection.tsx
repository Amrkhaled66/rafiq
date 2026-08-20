import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { LESSON_WEEKDAY_LABELS } from "@/shared/const/weekdays";
import Table from "@/shared/components/Table";

export default function ProfileLessonsSection({
  lessons,
  isLoading,
}: {
  lessons: Lesson[];
  isLoading: boolean;
}) {
  const columns = useMemo<TableColumn<Lesson>[]>(
    () => [
      { name: "الدرس", selector: (row) => row.name, grow: 1.5 },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "يوم المشاهدة",
        selector: (row) => LESSON_WEEKDAY_LABELS[row.weekday] ?? row.weekday,
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      data={lessons}
      progressPending={isLoading}
      progressComponent={
        <div className="text-subTitle py-6 text-sm">جاري تحميل الدروس...</div>
      }
      noDataComponent={
        <div className="text-subTitle py-6 text-sm">
          لا توجد دروس مجدولة لهذا الطالب.
        </div>
      }
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 20, 50]}
      responsive
      highlightOnHover
      persistTableHead
    />
  );
}
