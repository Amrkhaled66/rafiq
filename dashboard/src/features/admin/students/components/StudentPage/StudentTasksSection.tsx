import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { StudentOverviewTask } from "@/features/admin/students/services/studentService";
import Table from "@/shared/components/Table";

function TaskStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: {
      label: "متبقي",
      className: "bg-amber-100 text-amber-700",
    },
    done: {
      label: "مكتمل",
      className: "bg-emerald-100 text-emerald-700",
    },
    missed: {
      label: "فائت",
      className: "bg-rose-100 text-rose-700",
    },
  };

  const display = statusMap[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${display.className}`}
    >
      {display.label}
    </span>
  );
}

export default function StudentTasksSection({
  tasks,
}: {
  tasks: StudentOverviewTask[];
}) {
  const taskColumns = useMemo<TableColumn<StudentOverviewTask>[]>(
    () => [
      {
        name: "اسم التاسك",
        selector: (row) => row.title,
        grow: 1.5,
      },
      {
        name: "المادة",
        selector: (row) => row.subject,
      },
      {
        name: "الحالة",
        cell: (row) => <TaskStatusBadge status={row.status} />,
      },
      {
        name: "عدد الجلسات",
        selector: (row) => row.sessionsCount,
        center: true,
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">مهام اليوم</h2>
        <p className="text-subTitle mt-1 text-sm">
          جدول مهام الطالب المقررة لليوم.
        </p>
      </div>

      <Table
        columns={taskColumns}
        data={tasks}
        responsive
        persistTableHead
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد مهام لليوم حالياً.
          </div>
        }
      />
    </section>
  );
}
