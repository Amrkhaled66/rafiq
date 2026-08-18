import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { MissedTaskRow } from "@/features/admin/missed-tasks/services/missedTasksService";
import Table from "@/shared/components/Table";

export default function ProfileMissedTasksSection({
  tasks,
}: {
  tasks: MissedTaskRow[];
}) {
  const columns = useMemo<TableColumn<MissedTaskRow>[]>(
    () => [
      {
        name: "اسم المهمة",
        selector: (row) => row.taskName,
        grow: 1.5,
      },
      {
        name: "المادة",
        selector: (row) => row.subject,
      },
      {
        name: "الخطة",
        selector: (row) => row.planName,
      },
      {
        name: "الميعاد",
        selector: (row) => row.dueAt,
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
            {row.isResolved ? "تم الحل" : "لم يتم الحل"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">المهام الفائتة</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع المهام الفائتة للطالب ({tasks.length} مهمة).
        </p>
      </div>

      <Table
        columns={columns}
        data={tasks}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        responsive
        highlightOnHover
        persistTableHead
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد مهام فائتة.
          </div>
        }
      />
    </section>
  );
}
